import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { queryOne, execute } from "@/auth/db";
import { generateResponse } from "@/lib/anthropic";

const PROMPTS: Record<string, string> = {
  summary:
    "Provide a concise executive summary of this financial document in 4-5 sentences. Focus on the purpose of the document, key conclusions, and most important points.",
  metrics:
    "Extract the most important financial metrics, numbers, and KPIs found in this document. Present each metric clearly with its value. If no explicit numbers exist, describe the key financial themes.",
  risks:
    "Identify the top risks, concerns, or red flags mentioned or implied in this document. Be specific and reference relevant parts of the document.",
  recommendations:
    "Based on this document, provide 3-4 actionable recommendations or key takeaways that a stakeholder should consider.",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await req.json();

  // 1. Check if insights are already cached
  const doc = await queryOne<{
    id: string;
    raw_text: string;
    insights: Record<string, string> | null;
  }>(
    "SELECT id, raw_text, insights FROM documents WHERE id = $1 AND user_id = $2",
    [documentId, session.user.id]
  );

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Return cached insights if they exist
  if (doc.insights) {
    return NextResponse.json(doc.insights);
  }

  // 2. Generate fresh insights with Claude
  const systemPrompt = `You are a senior financial analyst. Analyze the following document and respond concisely.\n\nDOCUMENT:\n${doc.raw_text.slice(0, 48000)}`;

  const insights: Record<string, string> = {};

  for (const [key, prompt] of Object.entries(PROMPTS)) {
    try {
      insights[key] = await generateResponse(systemPrompt, prompt);
    } catch (error) {
      console.error(`Failed to generate ${key}:`, error);
      insights[key] = "Failed to generate this insight. Please try again.";
    }
  }

  // 3. Cache insights in database so we don't regenerate them
  await execute(
    "UPDATE documents SET insights = $1, updated_at = NOW() WHERE id = $2",
    [JSON.stringify(insights), documentId]
  );

  return NextResponse.json(insights);
}