import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

// Varsayılan parola yok: ADMIN_PASSWORD tanımlı değilse giriş tamamen
// reddedilir. Daha önce "change-me" değerine düşüyordu ve env tanımlanmamış
// her ortamda admin paneli herkese açık hale geliyordu.
function secret(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

function sign(value: string, key: string): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

export function makeSessionToken(): string {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD tanımlı değil");
  const payload = "admin";
  return `${payload}.${sign(payload, key)}`;
}

function isValidToken(token: string): boolean {
  const key = secret();
  if (!key) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload, key);
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
  const expected = secret();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
