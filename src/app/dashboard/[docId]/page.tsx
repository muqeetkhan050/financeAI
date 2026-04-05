import { InsightCards } from "@/components/InsightCards";
import { ChatInterface } from "@/components/ChatInterface";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock document data — will be replaced with real DB query
const MOCK_DOC = {
  id: "1",
  file_name: "Q3-2025-Financial-Report.docx",
  created_at: "2026-04-01",
};

export default async function DocPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;



  const doc = MOCK_DOC;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back link + header */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-zinc-500
          hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to documents
      </Link>

      <h1 className="text-2xl font-bold">{doc.file_name}</h1>
      <p className="text-sm text-zinc-500 mt-1 mb-8">
        Uploaded {new Date(doc.created_at).toLocaleDateString()}
      </p>

      {/* Insight cards */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-amber-500 mb-4">
          AI-generated insights
        </h2>
        <InsightCards documentId={docId} />
      </section>

      {/* Chat */}
      <section>
        <h2 className="text-lg font-semibold text-amber-500 mb-4">
          Ask questions about your document
        </h2>
        <ChatInterface documentId={docId} />
      </section>
    </div>
  );
}