import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function secret(): string {
  return process.env.ADMIN_PASSWORD || "change-me";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function makeSessionToken(): string {
  const payload = "admin";
  return `${payload}.${sign(payload)}`;
}

function isValidToken(token: string): boolean {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return isValidToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "change-me";
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
