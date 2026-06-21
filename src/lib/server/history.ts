import { sql, ensureSchema } from "./db";

export type HistoryContentType = "video" | "book";

export interface HistoryEntry {
  contentType: HistoryContentType;
  contentId: number;
  viewedAt: string;
}

interface HistoryRow {
  content_type: HistoryContentType;
  content_id: number;
  viewed_at: string;
}

export async function logHistoryView(
  userId: number,
  contentType: HistoryContentType,
  contentId: number
): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO history (user_id, content_type, content_id)
    VALUES (${userId}, ${contentType}, ${contentId})
  `;
}

/**
 * Returns the most recent distinct items a user has viewed, newest first.
 * "Distinct" means each content item appears once, at its most recent
 * viewing time — reopening something moves it back to the top rather than
 * creating a duplicate entry in the list.
 */
export async function getRecentHistory(
  userId: number,
  limit: number
): Promise<HistoryEntry[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT content_type, content_id, MAX(viewed_at) AS viewed_at
    FROM history
    WHERE user_id = ${userId}
    GROUP BY content_type, content_id
    ORDER BY viewed_at DESC
    LIMIT ${limit}
  `;
  return (rows as HistoryRow[]).map((r) => ({
    contentType: r.content_type,
    contentId: r.content_id,
    viewedAt: r.viewed_at,
  }));
}
