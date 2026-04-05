import { FileUpload } from "@/components/FileUpload";
import { DocumentList } from "@/components/DocumentList";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your documents</h1>
      <FileUpload />
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-300 mb-4">
          Recent documents
        </h2>
        <DocumentList />
      </div>
    </div>
  );
}