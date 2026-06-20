import { NextRequest } from "next/server";
import { getUserBySessionToken, User } from "./auth";

const SESSION_COOKIE = "mindful_session";

export function getCurrentUser(req: NextRequest): User | undefined {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return undefined;
  return getUserBySessionToken(token);
}
