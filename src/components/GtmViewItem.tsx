"use client";

import { useEffect } from "react";
import { pushToDataLayer, profileToGtmItem } from "@/lib/gtm";
import type { Profile } from "@/lib/profiles";

export default function GtmViewItem({ profile }: { profile: Profile }) {
  useEffect(() => {
    pushToDataLayer({
      event: "view_item",
      items: [profileToGtmItem(profile)],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
