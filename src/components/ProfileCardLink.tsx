"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { pushToDataLayer, profileToGtmItem } from "@/lib/gtm";
import type { Profile } from "@/lib/profiles";

type ProfileCardLinkProps = {
  profile: Profile;
  className?: string;
  children: ReactNode;
};

export default function ProfileCardLink({
  profile,
  className,
  children,
}: ProfileCardLinkProps) {
  return (
    <Link
      href={`/users/${profile.id}`}
      className={className}
      onClick={() =>
        pushToDataLayer({
          event: "select_item",
          item_list_name: "Profil Listesi",
          items: [profileToGtmItem(profile)],
        })
      }
    >
      {children}
    </Link>
  );
}
