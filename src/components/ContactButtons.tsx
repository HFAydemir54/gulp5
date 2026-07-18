"use client";

import { pushToDataLayer, profileToGtmItem } from "@/lib/gtm";
import { toTelHref } from "@/lib/phone";
import type { Profile } from "@/lib/profiles";

type ContactButtonsProps = {
  profile: Profile;
  whatsappUrl: string | null;
};

export default function ContactButtons({ profile, whatsappUrl }: ContactButtonsProps) {
  const telHref = toTelHref(profile.phone);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      {telHref ? (
        <a
          href={telHref}
          onClick={() =>
            pushToDataLayer({
              event: "generate_lead",
              method: "phone",
              items: [profileToGtmItem(profile)],
            })
          }
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--site-accent)] px-4 py-3 text-sm font-medium text-[var(--site-accent-text)] transition hover:bg-[var(--site-accent-hover)]"
        >
          Telefon ile Ara
        </a>
      ) : (
        <p className="flex flex-1 items-center justify-center rounded-lg bg-[var(--site-card-bg)] px-4 py-3 text-sm text-[var(--site-muted)]">
          Telefon numarası geçersiz
        </p>
      )}
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            pushToDataLayer({
              event: "generate_lead",
              method: "whatsapp",
              items: [profileToGtmItem(profile)],
            })
          }
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          WhatsApp&apos;tan Yaz
        </a>
      ) : (
        <p className="flex flex-1 items-center justify-center rounded-lg bg-[var(--site-card-bg)] px-4 py-3 text-sm text-[var(--site-muted)]">
          WhatsApp numarası geçersiz
        </p>
      )}
    </div>
  );
}
