import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { isAdminAuthenticated, isAdminEnabled } from "@/lib/auth";

export async function GET() {
  if (!isAdminEnabled()) return notFound();

  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}
