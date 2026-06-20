import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/requestAuth";

export async function GET(req: NextRequest) {
  const user = getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: { id: user.id, email: user.email, displayName: user.display_name },
  });
}
