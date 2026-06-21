import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sql, ensureSchema } from "./db";
import { MACRO_CATEGORIES, CATEGORIES } from "@/lib/content";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const BCRYPT_ROUNDS = 10;

export interface User {
  id: number;
  email: string;
  display_name: string;
}

function defaultCategoryBudgets() {
  return MACRO_CATEGORIES.map((macro) => ({
    macroCategory: macro,
    enabled: true,
    weeklyMinutesLimit: macro === "Entertainment" ? 180 : null,
  }));
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(
  email: string,
  passwordHash: string,
  displayName: string
): Promise<number> {
  await ensureSchema();

  const rows = await sql`
    INSERT INTO users (email, password_hash, display_name)
    VALUES (${email.toLowerCase().trim()}, ${passwordHash}, ${displayName})
    RETURNING id
  `;
  const userId = Number(rows[0].id);

  await sql`INSERT INTO user_stats (user_id) VALUES (${userId})`;

  await sql`
    INSERT INTO user_settings (user_id, category_budgets, kid_allowed_micro_categories)
    VALUES (
      ${userId},
      ${JSON.stringify(defaultCategoryBudgets())},
      ${JSON.stringify(CATEGORIES)}
    )
  `;

  return userId;
}

export async function findUserByEmail(
  email: string
): Promise<(User & { password_hash: string }) | undefined> {
  await ensureSchema();
  const rows = await sql`
    SELECT id, email, password_hash, display_name
    FROM users
    WHERE email = ${email.toLowerCase().trim()}
  `;
  return rows[0] as (User & { password_hash: string }) | undefined;
}

export async function findUserById(id: number): Promise<User | undefined> {
  await ensureSchema();
  const rows = await sql`
    SELECT id, email, display_name FROM users WHERE id = ${id}
  `;
  return rows[0] as User | undefined;
}

export async function createSession(userId: number): Promise<string> {
  await ensureSchema();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt})
  `;

  return token;
}

export async function getUserBySessionToken(
  token: string
): Promise<User | undefined> {
  await ensureSchema();
  const rows = await sql`
    SELECT users.id, users.email, users.display_name
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ${token} AND sessions.expires_at > now()
  `;
  return rows[0] as User | undefined;
}

export async function deleteSession(token: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}
