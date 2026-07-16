"use client";

import { useRouter } from "next/navigation";

export default function BackToListLink({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className={className}
    >
      ← Tüm escortlar
    </button>
  );
}
