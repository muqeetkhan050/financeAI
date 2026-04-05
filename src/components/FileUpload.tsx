

"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".docx")) {
      alert("Only .docx files are supported");
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    // TODO: Will connect to API in backend step
    // For now, simulate a 2 second upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    // TODO: router.push(`/dashboard/${doc.id}`) after real upload
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
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
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200
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
      ) : fileName ? (
        <CheckCircle size={40} className="mx-auto mb-3 text-green-500" />
      ) : (
        <Upload size={40} className="mx-auto mb-3 text-zinc-400" />
      )}

      <p className="text-lg font-semibold text-zinc-200">
        {isUploading
          ? "Processing document..."
          : fileName
          ? fileName
          : "Drop your .docx file here"}
      </p>

      <p className="text-sm text-zinc-500 mt-2">
        {isUploading
          ? "Extracting text and generating embeddings..."
          : fileName
          ? "Document uploaded successfully"
          : "or click to browse — Word documents only"}
      </p>
    </div>
  );
}