import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const MODEL = "llama-3.3-70b-versatile";

// One-shot call — used for generating insights
export async function generateResponse(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

// Streaming call — used for chat (returns tokens one at a time)
export async function* streamResponse(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const stream = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) {
      yield {
        type: "content_block_delta" as const,
        delta: { type: "text_delta" as const, text },
      };
    }
  }
}
