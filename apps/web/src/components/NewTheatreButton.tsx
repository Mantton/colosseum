"use client";

import { AlertTriangleIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { CreateNewTheatreFormSchema } from "@/lib/validations/theatre";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotPulse } from "@uiball/loaders";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
type FormData = z.infer<typeof CreateNewTheatreFormSchema>;

const Loader = () => <DotPulse size={20} speed={1} color="white" />;

const ErrorInfoHover = ({ message }: { message: string }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <AlertTriangleIcon className="w-4 h-4 text-destructive" />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-sm font-light">
          <p>{message}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export const NewTheatreButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(CreateNewTheatreFormSchema) });

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const {
        data: { slug },
      } = await api.post("v1/theatre/create", {
        name: formData.name,
        slug: formData.identifier,
        website: formData.website,
      });
      push(`/theatres/${slug}`);
    } catch (err) {
      if (
        err instanceof AxiosError &&
        [401, 429].includes(err.response?.status ?? 0)
      ) {
        switch (err.response?.status) {
          case 401:
            push("/login");
            break;
          case 429:
            toast({
              title: "Hold it partner!",
              description:
                "You're creating too many theatres. Try again in a bit.",
              variant: "destructive",
            });
            break;
        }
      } else {
        toast({
          title: "Oh Barnacles",
          description: "An error occurred on our end. Try again in a bit.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div className="flex gap-1 items-center">
            <PlusIcon className="h-5 w-5" />
            <span>New</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new theatre.</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo quis
            omnis earum, quasi sint voluptatibus.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} id="clsm">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">
                  <div className="flex items-center justify-end gap-2 ">
                    {errors.name?.message && (
                      <ErrorInfoHover message={errors.name.message} />
                    )}
                    <span className="">Name</span>
                  </div>
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  autoCapitalize="none"
                  autoCorrect="on"
                  disabled={isLoading}
                  {...register("name")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug">
                  <div className="flex items-center justify-end gap-2 ">
                    {errors.identifier?.message && (
                      <ErrorInfoHover message={errors.identifier.message} />
                    )}
                    <span className="">Identifier</span>
                  </div>
                </Label>
                <Input
                  id="identifier"
                  className="col-span-3"
                  autoCapitalize="none"
                  autoCorrect="on"
                  disabled={isLoading}
                  {...register("identifier")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website">
                  <div className="flex items-center justify-end gap-2 ">
                    {errors.website?.message && (
                      <ErrorInfoHover message={errors.website.message} />
                    )}
                    <span className="">Website</span>
                  </div>
                </Label>
                <Input
                  id="website"
                  className="col-span-3"
                  autoCapitalize="none"
                  autoCorrect="on"
                  disabled={isLoading}
                  {...register("website")}
                />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter>
          <Button type="submit" form="clsm">
            {isLoading ? <Loader></Loader> : <span>Get Started</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTheatreButton;
