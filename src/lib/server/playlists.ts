import { sql, ensureSchema } from "./db";

export type PlaylistContentType = "video" | "book";

export interface Playlist {
  id: number;
  userId: number;
  name: string;
  contentType: PlaylistContentType;
  createdAt: string;
  itemCount: number;
}

export interface PlaylistItem {
  id: number;
  contentId: number;
  position: number;
  addedAt: string;
}

interface PlaylistRow {
  id: number;
  user_id: number;
  name: string;
  content_type: PlaylistContentType;
  created_at: string;
  item_count: number | string;
}

interface PlaylistItemRow {
  id: number;
  content_id: number;
  position: number;
  added_at: string;
}

export async function getPlaylists(
  userId: number,
  contentType?: PlaylistContentType
): Promise<Playlist[]> {
  await ensureSchema();

  const rows = contentType
    ? await sql`
        SELECT p.id, p.user_id, p.name, p.content_type, p.created_at,
               COUNT(pi.id) AS item_count
        FROM playlists p
        LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
        WHERE p.user_id = ${userId} AND p.content_type = ${contentType}
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `
    : await sql`
        SELECT p.id, p.user_id, p.name, p.content_type, p.created_at,
               COUNT(pi.id) AS item_count
        FROM playlists p
        LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
        WHERE p.user_id = ${userId}
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;

  return (rows as PlaylistRow[]).map((r) => ({
    id: r.id,
    userId: r.user_id,
    name: r.name,
    contentType: r.content_type,
    createdAt: r.created_at,
    itemCount: Number(r.item_count),
  }));
}

export async function getPlaylistById(
  userId: number,
  playlistId: number
): Promise<Playlist | undefined> {
  await ensureSchema();
  const rows = await sql`
    SELECT p.id, p.user_id, p.name, p.content_type, p.created_at,
           COUNT(pi.id) AS item_count
    FROM playlists p
    LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
    WHERE p.id = ${playlistId} AND p.user_id = ${userId}
    GROUP BY p.id
  `;
  const row = rows[0] as PlaylistRow | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    contentType: row.content_type,
    createdAt: row.created_at,
    itemCount: Number(row.item_count),
  };
}

export async function getPlaylistItems(
  playlistId: number
): Promise<PlaylistItem[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT id, content_id, position, added_at
    FROM playlist_items
    WHERE playlist_id = ${playlistId}
    ORDER BY position ASC, added_at ASC
  `;
  return (rows as PlaylistItemRow[]).map((r) => ({
    id: r.id,
    contentId: r.content_id,
    position: r.position,
    addedAt: r.added_at,
  }));
}

export async function createPlaylist(
  userId: number,
  name: string,
  contentType: PlaylistContentType
): Promise<number> {
  await ensureSchema();
  const rows = await sql`
    INSERT INTO playlists (user_id, name, content_type)
    VALUES (${userId}, ${name}, ${contentType})
    RETURNING id
  `;
  return Number(rows[0].id);
}

export async function renamePlaylist(
  userId: number,
  playlistId: number,
  name: string
): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`
    UPDATE playlists SET name = ${name}
    WHERE id = ${playlistId} AND user_id = ${userId}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deletePlaylist(
  userId: number,
  playlistId: number
): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`
    DELETE FROM playlists
    WHERE id = ${playlistId} AND user_id = ${userId}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function addItemToPlaylist(
  userId: number,
  playlistId: number,
  contentId: number
): Promise<boolean> {
  await ensureSchema();

  // Confirm the playlist belongs to this user before writing to it.
  const owns = await getPlaylistById(userId, playlistId);
  if (!owns) return false;

  const posRows = await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS next_position
    FROM playlist_items WHERE playlist_id = ${playlistId}
  `;
  const nextPosition = Number(posRows[0].next_position);

  await sql`
    INSERT INTO playlist_items (playlist_id, content_id, position)
    VALUES (${playlistId}, ${contentId}, ${nextPosition})
    ON CONFLICT (playlist_id, content_id) DO NOTHING
  `;
  return true;
}

export async function removeItemFromPlaylist(
  userId: number,
  playlistId: number,
  contentId: number
): Promise<boolean> {
  await ensureSchema();

  const owns = await getPlaylistById(userId, playlistId);
  if (!owns) return false;

  await sql`
    DELETE FROM playlist_items
    WHERE playlist_id = ${playlistId} AND content_id = ${contentId}
  `;
  return true;
}
