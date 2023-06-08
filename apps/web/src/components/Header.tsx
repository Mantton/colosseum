import { getCurrentUser } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import Link from "next/link";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="fixed top-0 z-30 w-full backdrop-blur duration-100 bg-zinc-100/50 ">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="mr-4 shrink-0 z-50">
            <a href="/" aria-label="Mantton">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-zinc-900">
                  Colosseum
                </span>
              </div>
            </a>
          </div>

          <div className="">
            {user && <UserMenu />}
            {!user && (
              <Link
                className={buttonVariants({ variant: "secondary" })}
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
