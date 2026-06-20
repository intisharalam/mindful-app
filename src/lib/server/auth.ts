import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb } from "./db";
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

export function createUser(
  email: string,
  passwordHash: string,
  displayName: string
): number {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)"
    )
    .run(email.toLowerCase().trim(), passwordHash, displayName);

  const userId = Number(result.lastInsertRowid);

  db.prepare(
    "INSERT INTO user_stats (user_id) VALUES (?)"
  ).run(userId);

  db.prepare(
    `INSERT INTO user_settings (user_id, category_budgets, kid_allowed_micro_categories)
     VALUES (?, ?, ?)`
  ).run(
    userId,
    JSON.stringify(defaultCategoryBudgets()),
    JSON.stringify(CATEGORIES)
  );

  return userId;
}

export function findUserByEmail(
  email: string
): (User & { password_hash: string }) | undefined {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, email, password_hash, display_name FROM users WHERE email = ?"
    )
    .get(email.toLowerCase().trim()) as
    | (User & { password_hash: string })
    | undefined;
  return row;
}

export function findUserById(id: number): User | undefined {
  const db = getDb();
  const row = db
    .prepare("SELECT id, email, display_name FROM users WHERE id = ?")
    .get(id) as User | undefined;
  return row;
}

export function createSession(userId: number): string {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, userId, expiresAt);

  return token;
}

export function getUserBySessionToken(token: string): User | undefined {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT users.id, users.email, users.display_name
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ? AND sessions.expires_at > datetime('now')`
    )
    .get(token) as User | undefined;
  return row;
}

export function deleteSession(token: string): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
