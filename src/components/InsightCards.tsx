
"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Loader2,
} from "lucide-react";

const CARDS = [
  { key: "summary", title: "Executive summary", icon: FileText },
  { key: "metrics", title: "Key metrics", icon: TrendingUp },
  { key: "risks", title: "Risks & concerns", icon: AlertTriangle },
  { key: "recommendations", title: "Recommendations", icon: Lightbulb },
] as const;

export function InsightCards({ documentId }: { documentId: string }) {
  const [insights, setInsights] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load insights");
        return res.json();
      })
      .then(setInsights)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [documentId]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CARDS.map(({ key, title, icon: Icon }) => (
        <div
          key={key}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon size={18} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wide">
              {title}
            </h3>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Loader2 size={14} className="animate-spin" />
                Analyzing with AI...
              </div>
              <div className="h-3 bg-zinc-800 rounded w-full animate-pulse" />
              <div className="h-3 bg-zinc-800 rounded w-4/5 animate-pulse" />
              <div className="h-3 bg-zinc-800 rounded w-3/5 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {insights?.[key] || "No insight available."}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}