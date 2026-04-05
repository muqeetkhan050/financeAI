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

// Mock insights — will be replaced with real API call
const MOCK_INSIGHTS: Record<string, string> = {
  summary:
    "The Q3 2025 financial report shows strong revenue growth of 15% year-over-year, reaching $12.4M. Operating margins improved to 22% from 18% in Q2. The company achieved positive free cash flow for the second consecutive quarter. Customer acquisition costs decreased by 8% while lifetime value increased.",
  metrics:
    "Revenue: $12.4M (+15% YoY)\nGross Margin: 68%\nOperating Margin: 22%\nFree Cash Flow: $1.8M\nCustomer Count: 2,847 (+340 net new)\nARR: $48.2M\nNRR: 118%\nCAC Payback: 14 months",
  risks:
    "1. Enterprise deal concentration — top 5 customers represent 32% of revenue, creating dependency risk.\n2. Increasing competition in the mid-market segment with two new entrants offering aggressive pricing.\n3. Engineering headcount is 15% below plan, which may delay the Q4 product roadmap.\n4. Foreign exchange exposure increasing as international revenue grows to 28% of total.",
  recommendations:
    "1. Diversify the customer base by accelerating SMB acquisition — target reducing top-5 concentration below 25% by Q2 2026.\n2. Fast-track the hiring pipeline for engineering roles, consider acqui-hire opportunities.\n3. Implement FX hedging strategy now that international revenue exceeds 25% threshold.\n4. Lock in annual contracts with key enterprise accounts before competitor pricing pressure increases.",
};

export function InsightCards({ documentId }: { documentId: string }) {
  const [insights, setInsights] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    // fetch("/api/insights", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ documentId }),
    // })
    //   .then((r) => r.json())
    //   .then(setInsights)
    //   .finally(() => setLoading(false));

    // Simulate loading delay
    const timer = setTimeout(() => {
      setInsights(MOCK_INSIGHTS);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [documentId]);

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
                Analyzing...
              </div>
              {/* Skeleton lines */}
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