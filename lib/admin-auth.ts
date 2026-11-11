import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cp_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function password(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length >= 8 ? value : null;
}

function tokenFor(secret: string): string {
  return createHmac("sha256", secret).update("cerity-people-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function adminConfigured(): boolean {
  return password() !== null;
}

export function checkPassword(input: string): boolean {
  const secret = password();
  if (!secret) return false;
  return safeEqual(tokenFor(input), tokenFor(secret));
}

export async function startAdminSession(): Promise<void> {
  const secret = password();
  if (!secret) return;
  const store = await cookies();
  store.set(ADMIN_COOKIE, tokenFor(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const secret = password();
  if (!secret) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, tokenFor(secret));
}
