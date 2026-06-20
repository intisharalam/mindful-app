import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/requestAuth";
import { getUserStats, saveUserStats, UserStats } from "@/lib/server/stats";

export async function GET(req: NextRequest) {
  const user = getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const stats = getUserStats(user.id);
  return NextResponse.json({ stats });
}

export async function PATCH(req: NextRequest) {
  const user = getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Partial<UserStats>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const current = getUserStats(user.id);
  const next: UserStats = {
    streak: body.streak ?? current.streak,
    level: body.level ?? current.level,
    xp: body.xp ?? current.xp,
    shortSkipsInRow: body.shortSkipsInRow ?? current.shortSkipsInRow,
    deepSeconds: body.deepSeconds ?? current.deepSeconds,
    shortSeconds: body.shortSeconds ?? current.shortSeconds,
    shortsBlocked: body.shortsBlocked ?? current.shortsBlocked,
  };

  saveUserStats(user.id, next);
  return NextResponse.json({ stats: next });
}
