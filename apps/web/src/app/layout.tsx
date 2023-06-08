import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Colosseum",
  description: "Audience engagement made easy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* @ts-expect-error Async Server Component */}
        <Header />
        <div className="h-16 md:h-20"></div>
        <div className="flex flex-col min-h-screen overflow-hidden container py-2">
          <main className="relative">{children}</main>
          <Toaster />
        </div>
        <Footer />
      </body>
    </html>
  );
}
