import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
  return (
    <div>
      <div className="flex gap-2 items-center justify-center min-h-[75vh] flex-col md:flex-row mx-auto px-4">
        <div className="md:max-w-[50%] flex flex-col gap-4 ">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Audience Engagement Made Easy.
          </h1>
          <p className="text-lg font-light">
            With Colosseum, connecting and interacting with your audience has
            never been so seamless. Harness the power of meaningful discussions,
            foster community building, and increase user engagement
            effortlessly. We provide the perfect environment for vibrant
            conversations, driving traffic, and expanding your online presence.
          </p>

          <div className="flex">
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/theatres"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="w-[250px] h-[250px] lg:w-[500px] lg:h-[500px] relative md:max-w-[50%]">
          <Image src="/communication.svg" alt="communication" fill />
        </div>
      </div>
    </div>
  );
}
