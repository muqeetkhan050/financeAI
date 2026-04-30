

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
// import { Providers } from "@/components/Providers";
import Providers from "@/components/Providers";
import { AppShell } from "@/app/AppShell";

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
           
                <AppShell>
                  {children}
                </AppShell>
        </Providers>
      </body>
    </html>
  );
}