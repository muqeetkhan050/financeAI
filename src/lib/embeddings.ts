
import { query, execute } from '../auth/db';
import { pipeline, Tensor, type FeatureExtractionPipeline } from '@xenova/transformers';

// Singleton — model is downloaded once on first use (~25 MB) and cached locally
let embedder: FeatureExtractionPipeline | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2') as FeatureExtractionPipeline;
  }
  return embedder;
}

// Turn text into a 384-dimension vector locally (no API key needed)
export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getEmbedder();
  const output = await extractor(text, { pooling: 'mean', normalize: true }) as Tensor;
  return Array.from(output.data as Float32Array);
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

// Store all chunks for a document
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
