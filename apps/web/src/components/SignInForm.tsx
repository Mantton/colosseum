"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DotPulse } from "@uiball/loaders";
import { z } from "zod";
import { SignInFormSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { useToast } from "./ui/use-toast";
import { AxiosError } from "axios";

type FormData = z.infer<typeof SignInFormSchema>;
const Loader = () => <DotPulse size={20} speed={1} color="white" />;

export default function SignInForm() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignInFormSchema),
  });

  const onSubmit = ({ email }: FormData) => {
    setIsLoading(true);

    api
      .post("/v1/auth/login", {
        email,
      })
      .then(() => {
        toast({
          title: "Check your mailbox!",
          description:
            "We've sent a single use magic link to your inbox, be sure to check your span as well.",
        });
      })
      .catch((err) => {
        if (err instanceof AxiosError && err.response?.status === 429) {
          toast({
            title: "Slow Down!",
            description:
              "Someone's been a little over-enthusiastic with their clicking! Try again in a little while.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Oh Barnacles!",
          description:
            "We're unable to process your request at this moment. Please try again later.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
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
            {errors?.email && (
              <p className="px-1 text-sx font-bold text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading ? <Loader /> : <span>Sign In</span>}
          </Button>
        </div>
      </form>
    </div>
  );
}
