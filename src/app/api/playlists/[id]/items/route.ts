import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/requestAuth";
import { addItemToPlaylist, removeItemFromPlaylist } from "@/lib/server/playlists";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const playlistId = Number(id);
  if (!Number.isFinite(playlistId)) {
    return NextResponse.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  let body: { contentId?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (typeof body.contentId !== "number") {
    return NextResponse.json({ error: "contentId is required" }, { status: 400 });
  }

  const ok = await addItemToPlaylist(user.id, playlistId, body.contentId);
  if (!ok) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const playlistId = Number(id);
  if (!Number.isFinite(playlistId)) {
    return NextResponse.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  const contentIdParam = req.nextUrl.searchParams.get("contentId");
  const contentId = Number(contentIdParam);
  if (!Number.isFinite(contentId)) {
    return NextResponse.json({ error: "contentId query param is required" }, { status: 400 });
  }

  const ok = await removeItemFromPlaylist(user.id, playlistId, contentId);
  if (!ok) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
