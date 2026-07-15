"use client";

import { useEffect } from "react";
import { pushToDataLayer, profileToGtmItem } from "@/lib/gtm";
import type { Profile } from "@/lib/profiles";

export default function GtmViewItemList({ profiles }: { profiles: Profile[] }) {
  useEffect(() => {
    pushToDataLayer({
      event: "view_item_list",
      item_list_name: "Profil Listesi",
      items: profiles.map(profileToGtmItem),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
