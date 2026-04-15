import { query, execute } from '../auth/db';

// Turn text into a 1536-dimension vector using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API failed: ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

// Store a single chunk with its embedding vector
export async function storeChunk(
  documentId: string,
  content: string,
  chunkIndex: number
) {
  const embedding = await generateEmbedding(content);
  const vectorStr = `[${embedding.join(",")}]`;

  await execute(
    `INSERT INTO chunks (document_id, content, embedding, chunk_index)
     VALUES ($1, $2, $3::vector, $4)`,
    [documentId, content, vectorStr, chunkIndex]
  );
}

// Store all chunks for a document (processes sequentially to avoid rate limits)
export async function storeAllChunks(
  documentId: string,
  chunks: { content: string; index: number }[]
) {
  for (const chunk of chunks) {
    await storeChunk(documentId, chunk.content, chunk.index);
  }
}

export async function searchSimilarChunks(
  documentId: string,
  queryText: string,
  topK = 5
): Promise<{ content: string; similarity: number }[]> {
  const queryEmbed = await generateEmbedding(queryText);
  const vectorStr = `[${queryEmbed.join(",")}]`;

  return query<{ content: string; similarity: number }>(
    `SELECT content,
            1 - (embedding <=> $1::vector) AS similarity
     FROM chunks
     WHERE document_id = $2
     ORDER BY embedding <=> $1::vector
     LIMIT $3`,
    [vectorStr, documentId, topK]
  );
}