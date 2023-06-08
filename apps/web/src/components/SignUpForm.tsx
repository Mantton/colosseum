"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { DotPulse } from "@uiball/loaders";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ZodError, z } from "zod";
import { SignUpFormSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, BadgeCheckIcon } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "./ui/use-toast";
import { AxiosError } from "axios";

type FormData = z.infer<typeof SignUpFormSchema>;
export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(
    null
  );

  const checkHandleAvailability = async (value: string) => {
    if (!value) {
      setIsHandleAvailable(null);
      return;
    }
    setIsCheckingHandle(true);
    try {
      const handle = await SignUpFormSchema.shape.handle.parseAsync(value);
      const { data } = await api.post("/v1/auth/flow/handle", {
        handle,
      });
      setIsHandleAvailable(data.available);
      clearErrors("handle");
    } catch (error) {
      if (error instanceof ZodError) {
        setError("handle", {
          message: error.formErrors.formErrors?.[0] ?? "validation error",
        });
        setIsHandleAvailable(null);
      } else {
        toast({
          title: "Oh Barnacles!",
          description:
            "It's not you, it's us. We currently cannot check if your requested handle is available, try again in a bit.",
          variant: "destructive",
        });
      }
    }
    setIsCheckingHandle(false);
  };
  const onSubmit = ({ email, handle }: FormData) => {
    setIsLoading(true);

    api
      .post("/v1/auth/register", {
        email,
        handle,
      })
      .then(() => {
        toast({
          title: "Check your mailbox!",
          description:
            "We've sent a single use magic link to your inbox, be sure to check your span as well. Your handle will be reserved for an hour.",
        });
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          switch (err.response?.status) {
            case 429:
              toast({
                title: "Slow Down!",
                description:
                  "Someone's been a little over-enthusiastic with their clicking! Try again in a little while.",
                variant: "destructive",
              });
              break;
            case 401:
              toast({
                title: "Handle Claimed!",
                description:
                  "Another user has claimed this handle already! If it is you check your mailbox for an activation link to complete the registration process.",
                variant: "destructive",
              });
              break;
            default:
              toast({
                title: "Oh Barnacles!",
                description:
                  "We're unable to process your request at this moment. Please try again later.",
                variant: "destructive",
              });
          }
        } else {
          toast({
            title: "Oh Barnacles!",
            description:
              "We're unable to process your request at this moment. Please try again later.",
            variant: "destructive",
          });
          setIsHandleAvailable(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 text-start">
          <div className="grid gap-2">
            <Label htmlFor="email">
              <div className="flex gap-2 items-center">
                <span>Email</span>
                {errors.email && (
                  <div className="flex gap-1 text-red-500 items-center">
                    <AlertCircleIcon className="h-4 w-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="handle">
              <div className="flex gap-2 items-center">
                <span>Handle</span>
                {(isHandleAvailable !== null || errors.handle) && (
                  <span>&#8226;</span>
                )}
                {!isCheckingHandle &&
                  isHandleAvailable !== null &&
                  (() => {
                    switch (isHandleAvailable) {
                      case true:
                        return (
                          <div className="flex gap-1 text-green-700 items-center">
                            <BadgeCheckIcon className="h-4 w-4" />
                            <span>Available</span>
                          </div>
                        );
                      case false:
                        return (
                          <div className="flex gap-1 text-red-500 items-center">
                            <AlertCircleIcon className="h-4 w-4" />
                            <span>Unavailable</span>
                          </div>
                        );
                    }
                  })()}
                {!isCheckingHandle && errors.handle && (
                  <div className="flex gap-1 text-red-500 items-center">
                    <AlertCircleIcon className="h-4 w-4" />
                    <span>{errors.handle.message}</span>
                  </div>
                )}
              </div>
            </Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="handle"
                placeholder=""
                type="text"
                autoCapitalize="none"
                autoComplete="none"
                autoCorrect="off"
                disabled={isLoading || isCheckingHandle}
                {...register("handle")}
              />
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const value = getValues("handle");
                  void checkHandleAvailability(value);
                }}
              >
                {isCheckingHandle ? (
                  <DotPulse size={15} speed={1} color="white" />
                ) : (
                  <span>Check</span>
                )}
              </Button>
            </div>
          </div>
          <Button
            disabled={isLoading || !isHandleAvailable || isCheckingHandle}
          >
            {isLoading ? (
              <DotPulse size={20} speed={1} color="white" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// type HandleAvailabilityProps = {value: boolean | null}
// const HandleAvailability = ({value}: HandleAvailabilityProps) => {

//     if (value !== null) {
//         if (value)
//     }
// }
