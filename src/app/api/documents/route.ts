import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { query, queryOne } from "@/auth/db";
import { extractTextFromBuffer } from "@/lib/docx-parser";
import { chunkText } from "@/lib/Chunker";
import { storeAllChunks } from "@/lib/embeddings";

// POST — upload and process a .docx file
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file?.name.endsWith(".docx")) {
      return NextResponse.json(
        { error: "Only .docx files allowed" },
        { status: 400 }
      );
    }

    // 1. Extract text from the Word document
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = await extractTextFromBuffer(buffer);

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from document" },
        { status: 400 }
      );
    }

    // 2. Save document record in database
    const doc = await queryOne<{ id: string }>(
      `INSERT INTO documents (user_id, file_name, raw_text)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [session.user.id, file.name, rawText]
    );

    // 3. Chunk the text and store with embeddings
    const chunks = chunkText(rawText);
    await storeAllChunks(doc!.id, chunks);

    return NextResponse.json({
      id: doc!.id,
      fileName: file.name,
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docs = await query<{
    id: string;
    file_name: string;
    created_at: Date;
    insights: { summary?: string } | null;
  }>(
    `SELECT id, file_name, created_at, insights
     FROM documents
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [session.user.id]
  );

  return NextResponse.json(docs);
}