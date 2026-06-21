import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/requestAuth";
import { getPlaylists, createPlaylist } from "@/lib/server/playlists";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const contentTypeParam = req.nextUrl.searchParams.get("contentType");
  const contentType =
    contentTypeParam === "video" || contentTypeParam === "book"
      ? contentTypeParam
      : undefined;

  const playlists = await getPlaylists(user.id, contentType);
  return NextResponse.json({ playlists });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { name?: string; contentType?: "video" | "book" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Playlist name is required" }, { status: 400 });
  }
  if (body.contentType !== "video" && body.contentType !== "book") {
    return NextResponse.json({ error: "contentType must be 'video' or 'book'" }, { status: 400 });
  }

  const id = await createPlaylist(user.id, body.name.trim(), body.contentType);
  return NextResponse.json({ id });
}
