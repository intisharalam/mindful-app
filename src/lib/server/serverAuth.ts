import { cookies } from "next/headers";
import { getUserBySessionToken, User } from "./auth";

const SESSION_COOKIE = "mindful_session";

export async function getCurrentUserFromCookies(): Promise<User | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return undefined;
  return getUserBySessionToken(token);
}
