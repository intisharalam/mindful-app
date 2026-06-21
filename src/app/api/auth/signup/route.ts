import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, hashPassword, createSession } from "@/lib/server/auth";

const SESSION_COOKIE = "mindful_session";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; displayName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, displayName } = body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }
  if (!displayName || displayName.trim().length === 0) {
    return NextResponse.json({ error: "Display name is required" }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const userId = await createUser(email, passwordHash, displayName.trim());
  const token = await createSession(userId);

  const res = NextResponse.json({
    user: { id: userId, email: email.toLowerCase().trim(), displayName: displayName.trim() },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
