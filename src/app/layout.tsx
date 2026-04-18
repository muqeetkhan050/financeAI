

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
// import { Providers } from "@/components/Providers";
import Providers from "@/components/Providers";
import  {Navbar}  from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FinanceAI Analyst",
  description: "Upload financial docs, get AI insights and chat",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}