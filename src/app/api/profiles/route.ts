import { NextRequest, NextResponse } from "next/server";
import { addProfile, getProfiles } from "@/lib/profiles";
import { isAdminAuthenticated } from "@/lib/auth";
import { normalizePhoneDigits, isValidPhoneDigits } from "@/lib/phone";

export async function GET() {
  const profiles = await getProfiles();
  return NextResponse.json(profiles);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const firstName = String(body.firstName || "").trim();
  const phone = String(body.phone || "").trim();
  const age = body.age !== undefined && body.age !== "" ? Number(body.age) : NaN;
  const city = String(body.city || "").trim();
  const meetingPlace = String(body.meetingPlace || "").trim();
  const about = String(body.about || "").trim();

  const rawImages = body.images;
  const images = Array.isArray(rawImages)
    ? rawImages.map((img) => String(img).trim()).filter(Boolean)
    : typeof rawImages === "string"
    ? rawImages.split("\n").map((img) => img.trim()).filter(Boolean)
    : [];

  const rawExpiresAt = body.expiresAt ? String(body.expiresAt).trim() : "";
  const expiresAt = rawExpiresAt && !isNaN(new Date(rawExpiresAt).getTime())
    ? new Date(rawExpiresAt).toISOString()
    : undefined;

  if (!firstName || !phone || isNaN(age) || age <= 0) {
    return NextResponse.json(
      { error: "firstName, phone ve geçerli bir age (yaş) zorunludur" },
      { status: 400 }
    );
  }

  if (!isValidPhoneDigits(normalizePhoneDigits(phone))) {
    return NextResponse.json(
      { error: "Geçerli bir telefon numarası giriniz" },
      { status: 400 }
    );
  }

  const profile = await addProfile({
    firstName,
    phone,
    age,
    city,
    meetingPlace,
    about,
    images,
    expiresAt,
  });
  return NextResponse.json(profile, { status: 201 });
}
