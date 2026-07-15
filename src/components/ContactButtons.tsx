"use client";

import { pushToDataLayer, profileToGtmItem } from "@/lib/gtm";
import type { Profile } from "@/lib/profiles";

type ContactButtonsProps = {
  profile: Profile;
  whatsappUrl: string;
};

export default function ContactButtons({ profile, whatsappUrl }: ContactButtonsProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <a
        href={`tel:${profile.phone}`}
        onClick={() =>
          pushToDataLayer({
            event: "generate_lead",
            method: "phone",
            items: [profileToGtmItem(profile)],
          })
        }
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-pink-100 dark:text-purple-900 dark:hover:bg-pink-200"
      >
        Telefon ile Ara
      </a>
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
    </div>
  );
}
