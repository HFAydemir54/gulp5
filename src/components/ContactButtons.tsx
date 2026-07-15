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
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-pink-100 px-4 py-3 text-sm font-medium text-purple-900 transition hover:bg-pink-200"
        >
          Telefon ile Ara
        </a>
      ) : (
        <p className="flex flex-1 items-center justify-center rounded-lg bg-purple-900/40 px-4 py-3 text-sm text-pink-300">
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
        <p className="flex flex-1 items-center justify-center rounded-lg bg-purple-900/40 px-4 py-3 text-sm text-pink-300">
          WhatsApp numarası geçersiz
        </p>
      )}
    </div>
  );
}
