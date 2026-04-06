"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: Replace with real NextAuth signIn
    // const result = await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });
    // if (result?.error) {
    //   setError("Invalid email or password");
    // } else {
    //   router.push("/dashboard");
    // }

    // Simulate login for now
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password.length >= 8) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password (min 8 chars)");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <BarChart3 size={32} className="mx-auto mb-3 text-amber-500" />
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Sign in to access your documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700
              text-zinc-200 focus:outline-none focus:border-amber-500
              placeholder:text-zinc-600"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700
              text-zinc-200 focus:outline-none focus:border-amber-500
              placeholder:text-zinc-600"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-600 text-zinc-950 font-bold rounded-xl
            hover:bg-amber-500 transition-colors disabled:opacity-50
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-zinc-500 text-sm mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-amber-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}