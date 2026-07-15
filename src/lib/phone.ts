/**
 * Scraped/manually entered phone numbers arrive in wildly inconsistent shapes:
 * literal "%20" sequences left over from bad scraping, numbers already
 * carrying a foreign country code, local Turkish numbers with/without the
 * leading 0, etc. This normalizes all of that down to bare E.164-ish digits.
 */
export function normalizePhoneDigits(raw: string): string {
  let value = raw.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // Malformed percent-sequence, fall back to the raw string.
  }

  const digits = value.replace(/\D/g, "");

  // "+90" mistakenly prepended in front of an already-local "0XXXXXXXXXX" number.
  if (digits.startsWith("900") && digits.length === 13) {
    return `90${digits.slice(3)}`;
  }
  // Already a full Turkish number with country code.
  if (digits.startsWith("90") && digits.length === 12) {
    return digits;
  }
  // Local Turkish format with leading 0.
  if (digits.startsWith("0") && digits.length === 11) {
    return `90${digits.slice(1)}`;
  }
  // 10-digit Turkish number missing both the leading 0 and country code.
  if (digits.length === 10 && !digits.startsWith("0")) {
    return `90${digits}`;
  }
  // Anything else: assume it already includes a (non-Turkish) country code.
  return digits;
}

export function isValidPhoneDigits(digits: string): boolean {
  return /^\d{10,15}$/.test(digits);
}

export function toWhatsappUrl(rawPhone: string, message: string): string | null {
  const digits = normalizePhoneDigits(rawPhone);
  if (!isValidPhoneDigits(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function toTelHref(rawPhone: string): string | null {
  const digits = normalizePhoneDigits(rawPhone);
  if (!isValidPhoneDigits(digits)) return null;
  return `tel:+${digits}`;
}
