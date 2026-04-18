

import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

// Returns all matching rows, fully typed
export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

// Returns first row or null
export async function queryOne<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

// For INSERT/UPDATE/DELETE — returns number of affected rows
export async function execute(
  text: string,
  params?: unknown[]
): Promise<number> {
  const result = await pool.query(text, params);
  return result.rowCount ?? 0;
}

export default pool;