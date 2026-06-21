import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/server/auth";

const SESSION_COOKIE = "mindful_session";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await deleteSession(token);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
