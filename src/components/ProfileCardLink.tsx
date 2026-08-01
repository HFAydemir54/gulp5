"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { pushToDataLayer, profileToGtmItem } from "@/lib/gtm";
import type { Profile } from "@/lib/profiles";
import { profilePath } from "@/lib/slug";

type ProfileCardLinkProps = {
  profile: Profile;
  className?: string;
  listName?: string;
  children: ReactNode;
};

export default function ProfileCardLink({
  profile,
  className,
  listName = "Escort Listesi",
  children,
}: ProfileCardLinkProps) {
  return (
    <Link
      href={profilePath(profile)}
      className={className}
      onClick={() =>
        pushToDataLayer({
          event: "select_item",
          item_list_name: listName,
          items: [profileToGtmItem(profile)],
        })
      }
    >
      {children}
    </Link>
  );
}
