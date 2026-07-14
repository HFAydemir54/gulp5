"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slotId: string;
  className?: string;
  label: string;
};

export default function AdSlot({ slotId, className, label }: AdSlotProps) {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script henüz yüklenmemiş olabilir, sorun değil.
    }
  }, []);

  if (!ADSENSE_CLIENT) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white text-xs text-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 ${className || ""}`}
      >
        {label}
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
