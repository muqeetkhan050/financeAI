import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// One-shot call — used for generating insights
export async function generateResponse(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

// Streaming call — used for chat (returns tokens one at a time)
export function streamResponse(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
) {
  return client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });
}