import { NextRequest, NextResponse } from "next/server";
import { deleteProfile, updateProfile } from "@/lib/profiles";
import { isAdminAuthenticated } from "@/lib/auth";
import { normalizePhoneDigits, isValidPhoneDigits } from "@/lib/phone";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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

  const profile = await updateProfile(id, {
    firstName,
    phone,
    age,
    city,
    meetingPlace,
    about,
    images,
    expiresAt,
  });
  if (!profile) {
    return NextResponse.json({ error: "Profil bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteProfile(id);
  return NextResponse.json({ ok: true });
}
