import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { getCurrentUser } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for colosseum",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    return redirect("/profile");
  }
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get you started.
          </p>
          <SignUpForm />
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign In.
          </Link>
        </p>
      </div>
    </div>
  );
}
