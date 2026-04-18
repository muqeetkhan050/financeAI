"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Dashboard
        </Link>
        <span className="text-sm text-zinc-500">{session.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="text-sm px-4 py-2 bg-amber-600 text-zinc-950 rounded-lg
          font-semibold hover:bg-amber-500 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
