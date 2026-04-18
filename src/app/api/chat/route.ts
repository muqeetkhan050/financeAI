import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { queryOne, query, execute } from "@/auth/db";
import { searchSimilarChunks } from "@/lib/embeddings";
import { streamResponse } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { documentId, message } = await req.json();

  // 1. Verify the document belongs to this user
  const doc = await queryOne<{ id: string; file_name: string }>(
    "SELECT id, file_name FROM documents WHERE id = $1 AND user_id = $2",
    [documentId, session.user.id]
  );

  if (!doc) {
    return new Response("Not found", { status: 404 });
  }

  // 2. RAG — find the most relevant chunks for this question
  const relevantChunks = await searchSimilarChunks(documentId, message, 5);
  const context = relevantChunks.map((c) => c.content).join("\n\n---\n\n");

  // 3. Get recent conversation history from database
  const history = await query<{
    role: "user" | "assistant";
    content: string;
  }>(
    `SELECT role, content FROM messages
     WHERE document_id = $1
     ORDER BY created_at DESC LIMIT 10`,
    [documentId]
  );

  // Build conversation (oldest first + new message)
  const conversationMessages = [
    ...history.reverse(),
    { role: "user" as const, content: message },
  ];

  // 4. Build system prompt with RAG context
  const systemPrompt = `You are a senior financial analyst AI assistant.
Answer questions based ONLY on the provided document sections below.
Be precise and cite specific numbers and sections when possible.
If something is not found in the provided context, say so honestly.

RELEVANT DOCUMENT SECTIONS:
${context}

DOCUMENT NAME: ${doc.file_name}`;

  // 5. Save user message to database
  await execute(
    "INSERT INTO messages (document_id, role, content) VALUES ($1, 'user', $2)",
    [documentId, message]
  );

  // 6. Stream Claude's response back
  const stream = streamResponse(systemPrompt, conversationMessages);
  const encoder = new TextEncoder();
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        // Save the complete assistant response
        await execute(
          "INSERT INTO messages (document_id, role, content) VALUES ($1, 'assistant', $2)",
          [documentId, fullResponse]
        );

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ text: "\n\nSorry, something went wrong." })}\n\n`
          )
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}