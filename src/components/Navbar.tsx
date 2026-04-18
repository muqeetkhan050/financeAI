import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { NavbarAuth } from "./NavbarAuth";

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <BarChart3 size={24} className="text-amber-500" />
        <span className="text-lg font-bold text-zinc-100">FinanceAI</span>
      </Link>
      <NavbarAuth />
    </nav>
  );
}
