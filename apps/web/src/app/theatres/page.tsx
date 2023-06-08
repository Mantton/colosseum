import NewTheatreButton from "@/components/NewTheatreButton";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type TheatreProp = {
  slug: string;
  name: string;
  datCreated: Date;
  website: string;
};
export default async function TheatresPage() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");
  const {
    data: { result: theatres },
  } = await api.get("/v1/theatre/managed", {
    headers: { Cookie: headers().get("Cookie") },
  });

  return (
    <div className="flex flex-col ">
      <div className="flex md:justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Theatres
        </h1>
        <NewTheatreButton />
      </div>
      {theatres?.[0] && (
        <div className="flex flex-col gap-3 pt-4">
          {theatres.map((theatre: TheatreProp) => {
            return (
              <div
                key={theatre.slug}
                className="rounded-md border p-4 flex flex-col gap-1"
              >
                <Link
                  href={`/theatres/${theatre.slug}`}
                  className="hover:underline text-lg font-semibold"
                >
                  {theatre.name}
                </Link>
                <Link
                  href={theatre.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {theatre.website}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
