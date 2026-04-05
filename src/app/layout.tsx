import "./globals.css";
import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FinanceAI Analyst",
  description: "Upload financial docs, get AI insights and chat",
};

function Navbar() {
  return (
    <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <BarChart3 size={24} className="text-amber-500" />
        <span className="text-lg font-bold text-zinc-100">FinanceAI</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 bg-amber-600 text-zinc-950 rounded-lg font-semibold hover:bg-amber-500 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}