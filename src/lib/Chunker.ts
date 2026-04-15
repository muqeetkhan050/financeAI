export interface TextChunk {
  content: string;
  index: number;
}

export function chunkText(
  text: string,
  maxTokens = 500,
  overlapTokens = 50
): TextChunk[] {
  const charLimit = maxTokens * 4; // ~4 chars per token
  const overlapChars = overlapTokens * 4;
  const chunks: TextChunk[] = [];
  const paragraphs = text.split(/\n\s*\n/);

  let current = "";
  let idx = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // If adding this paragraph would exceed the limit, save current chunk
    if (current.length + trimmed.length > charLimit && current) {
      chunks.push({ content: current.trim(), index: idx++ });

      // Keep overlap from end of previous chunk for context continuity
      const words = current.split(/\s+/);
      const overlapWords = words.slice(
        Math.max(0, words.length - Math.ceil(overlapChars / 5))
      );
      current = overlapWords.join(" ") + "\n\n" + trimmed;
    } else {
      current += (current ? "\n\n" : "") + trimmed;
    }
  }

  // Don't forget the last chunk
  if (current.trim()) {
    chunks.push({ content: current.trim(), index: idx });
  }

  return chunks;
}