import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { env } from "@/env";
import { type user } from "@prisma/client";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSessionToken(userId: number): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.magic_link.create({
    data: {
      token,
      user_id: userId,
      expires_at: expiresAt,
      used: true,
    },
  });

  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
}

export async function getSession(): Promise<user | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const magicLink = await db.magic_link.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!magicLink || magicLink.expires_at < new Date()) {
    return null;
  }

  return magicLink.user;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSession();
  return user?.role === "admin";
}

export async function requireAuth(): Promise<user> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(): Promise<user> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD;
}

