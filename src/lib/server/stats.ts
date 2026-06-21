import { sql, ensureSchema } from "./db";

export interface UserStats {
  streak: number;
  level: number;
  xp: number;
  shortSkipsInRow: number;
  deepSeconds: number;
  shortSeconds: number;
  shortsBlocked: number;
}

interface StatsRow {
  streak: number;
  level: number;
  xp: number;
  short_skips_in_row: number;
  deep_seconds: number | string;
  short_seconds: number | string;
  shorts_blocked: number;
}

export async function getUserStats(userId: number): Promise<UserStats> {
  await ensureSchema();

  const rows = await sql`
    SELECT streak, level, xp, short_skips_in_row, deep_seconds, short_seconds, shorts_blocked
    FROM user_stats WHERE user_id = ${userId}
  `;
  const row = rows[0] as StatsRow | undefined;

  if (!row) {
    await sql`INSERT INTO user_stats (user_id) VALUES (${userId})`;
    return {
      streak: 0,
      level: 1,
      xp: 0,
      shortSkipsInRow: 0,
      deepSeconds: 0,
      shortSeconds: 0,
      shortsBlocked: 0,
    };
  }

  return {
    streak: row.streak,
    level: row.level,
    xp: row.xp,
    shortSkipsInRow: row.short_skips_in_row,
    deepSeconds: Number(row.deep_seconds),
    shortSeconds: Number(row.short_seconds),
    shortsBlocked: row.shorts_blocked,
  };
}

export async function saveUserStats(
  userId: number,
  stats: UserStats
): Promise<void> {
  await ensureSchema();

  await sql`
    UPDATE user_stats SET
      streak = ${stats.streak},
      level = ${stats.level},
      xp = ${stats.xp},
      short_skips_in_row = ${stats.shortSkipsInRow},
      deep_seconds = ${stats.deepSeconds},
      short_seconds = ${stats.shortSeconds},
      shorts_blocked = ${stats.shortsBlocked},
      updated_at = now()
    WHERE user_id = ${userId}
  `;
}
