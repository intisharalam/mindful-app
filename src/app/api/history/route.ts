import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/requestAuth";
import { getRecentHistory, logHistoryView } from "@/lib/server/history";

const HISTORY_LIMIT = 3;

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const history = await getRecentHistory(user.id, HISTORY_LIMIT);
  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { contentType?: "video" | "book"; contentId?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (
    !body.contentType ||
    (body.contentType !== "video" && body.contentType !== "book") ||
    typeof body.contentId !== "number"
  ) {
    return NextResponse.json({ error: "contentType and contentId are required" }, { status: 400 });
  }

  await logHistoryView(user.id, body.contentType, body.contentId);
  const history = await getRecentHistory(user.id, HISTORY_LIMIT);
  return NextResponse.json({ history });
}
