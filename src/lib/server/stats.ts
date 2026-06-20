import { getDb } from "./db";

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
  deep_seconds: number;
  short_seconds: number;
  shorts_blocked: number;
}

export function getUserStats(userId: number): UserStats {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT streak, level, xp, short_skips_in_row, deep_seconds, short_seconds, shorts_blocked
       FROM user_stats WHERE user_id = ?`
    )
    .get(userId) as StatsRow | undefined;

  if (!row) {
    db.prepare("INSERT INTO user_stats (user_id) VALUES (?)").run(userId);
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
    deepSeconds: row.deep_seconds,
    shortSeconds: row.short_seconds,
    shortsBlocked: row.shorts_blocked,
  };
}

export function saveUserStats(userId: number, stats: UserStats): void {
  const db = getDb();
  db.prepare(
    `UPDATE user_stats SET
       streak = ?, level = ?, xp = ?, short_skips_in_row = ?,
       deep_seconds = ?, short_seconds = ?, shorts_blocked = ?,
       updated_at = datetime('now')
     WHERE user_id = ?`
  ).run(
    stats.streak,
    stats.level,
    stats.xp,
    stats.shortSkipsInRow,
    stats.deepSeconds,
    stats.shortSeconds,
    stats.shortsBlocked,
    userId
  );
}
