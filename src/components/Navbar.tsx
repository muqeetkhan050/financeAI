"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BarChart3, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <BarChart3 size={24} className="text-amber-500" />
        <span className="text-lg font-bold text-zinc-100">FinanceAI</span>
      </Link>

      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
        ) : session ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-sm text-zinc-500">{session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm px-4 py-2 bg-amber-600 text-zinc-950 rounded-lg
                font-semibold hover:bg-amber-500 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}