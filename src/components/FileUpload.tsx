

"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".docx")) {
      setError("Only .docx files are supported");
      return;
    }

    setIsUploading(true);
    setError("");
    setStatus(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const doc = await res.json();
      setStatus(`Done! ${doc.chunkCount} chunks created.`);

      // Navigate to the document analysis page
      setTimeout(() => {
        router.push(`/dashboard/${doc.id}`);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
    }
  };

  return (
    <div
      onClick={() => !isUploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      }}
      className={`border-2 border-dashed rounded-2xl p-12 text-center
        transition-all duration-200
        ${isUploading ? "cursor-wait" : "cursor-pointer"}
        ${
          isDragging
            ? "border-amber-500 bg-amber-500/5"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {isUploading ? (
        <Loader2
          size={40}
          className="mx-auto mb-3 animate-spin text-amber-500"
        />
      ) : (
        <Upload size={40} className="mx-auto mb-3 text-zinc-400" />
      )}

      <p className="text-lg font-semibold text-zinc-200">
        {isUploading ? status : "Drop your .docx file here"}
      </p>

      <p className="text-sm text-zinc-500 mt-2">
        {isUploading
          ? "Extracting text, generating embeddings..."
          : "or click to browse — Word documents only"}
      </p>

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
    </div>
  );
}