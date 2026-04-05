import Link from "next/link";
import { BarChart3, Upload, MessageSquare, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <BarChart3 size={48} className="mx-auto mb-6 text-amber-500" />
      <h1 className="text-4xl font-bold mb-4">FinanceAI Analyst</h1>
      <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
        Upload any financial Word document. Get instant AI-powered insights
        and chat with your data.
      </p>

      <Link
        href="/dashboard"
        className="inline-block px-8 py-4 bg-amber-600 text-zinc-950 text-lg
          font-bold rounded-xl hover:bg-amber-500 transition-colors"
      >
        Get Started
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[
          {
            icon: Upload,
            title: "Upload",
            desc: "Drop any .docx financial document",
          },
          {
            icon: Sparkles,
            title: "Insights",
            desc: "AI generates summary, metrics, risks",
          },
          {
            icon: MessageSquare,
            title: "Chat",
            desc: "Ask questions, get precise answers",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left"
          >
            <Icon size={24} className="text-amber-500 mb-3" />
            <h3 className="font-semibold text-zinc-200 mb-1">{title}</h3>
            <p className="text-sm text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}