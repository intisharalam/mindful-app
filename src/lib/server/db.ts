import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it in your Vercel project's Environment Variables (Storage tab > your Neon database > .env.local), or in a local .env.local file for local dev."
  );
}

// neon() returns a lightweight tagged-template SQL client over HTTP —
// safe to create per-invocation in a serverless environment, no connection
// pooling/lifecycle to manage ourselves.
export const sql = neon(process.env.DATABASE_URL);

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema();
  }
  return schemaReady;
}

async function createSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      expires_at TIMESTAMPTZ NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      streak INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      short_skips_in_row INTEGER NOT NULL DEFAULT 0,
      deep_seconds DOUBLE PRECISION NOT NULL DEFAULT 0,
      short_seconds DOUBLE PRECISION NOT NULL DEFAULT 0,
      shorts_blocked INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      mode TEXT NOT NULL DEFAULT 'parent',
      pin TEXT NOT NULL DEFAULT '1234',
      short_form_enabled BOOLEAN NOT NULL DEFAULT true,
      category_budgets TEXT NOT NULL DEFAULT '[]',
      kid_allowed_micro_categories TEXT NOT NULL DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_subscriptions (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      channel_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, channel_id)
    );
  `;
}
