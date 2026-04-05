"use client";

import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";

// Fake data for now — will be replaced with real API call
const MOCK_DOCS = [
  {
    id: "1",
    file_name: "Q3-2025-Financial-Report.docx",
    created_at: "2026-04-01",
    summary: "Revenue grew 15% year-over-year driven by strong enterprise sales...",
  },
  {
    id: "2",
    file_name: "Annual-Budget-2026.docx",
    created_at: "2026-03-28",
    summary: "Total projected budget of $4.2M with 30% allocated to R&D...",
  },
  {
    id: "3",
    file_name: "Investor-Update-March.docx",
    created_at: "2026-03-15",
    summary: "Company reached profitability in February with positive cash flow...",
  },
];

export function DocumentList() {
  // TODO: Replace with useDocuments() hook when backend is ready
  const documents = MOCK_DOCS;

  if (documents.length === 0) {
    return (
      <p className="text-zinc-500 text-center py-8">
        No documents yet. Upload your first .docx above.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4
            hover:border-zinc-600 transition-colors group"
        >
          <Link href={`/dashboard/${doc.id}`} className="block">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} className="text-amber-500 shrink-0" />
              <h3 className="text-sm font-semibold text-zinc-200 truncate">
                {doc.file_name}
              </h3>
            </div>
            <p className="text-xs text-zinc-500">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
              {doc.summary}
            </p>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: deleteDoc(doc.id) when backend is ready
              alert("Delete will work after backend setup");
            }}
            className="mt-3 text-zinc-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}