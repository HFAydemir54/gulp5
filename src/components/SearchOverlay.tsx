"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileGrid from "@/components/ProfileGrid";
import type { Profile } from "@/lib/profiles";
import { getRecentlyViewed, toProfile } from "@/lib/recentlyViewed";

function normalize(value: string): string {
  return value.toLocaleLowerCase("tr-TR").trim();
}

export default function SearchOverlay({ profiles }: { profiles: Profile[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Profile[]>([]);

  useEffect(() => {
    if (!open) return;
    // localStorage'a erişim sadece client'ta mümkün; overlay açıldığında
    // bilerek effect içinde okunuyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentlyViewed(getRecentlyViewed().map(toProfile));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const term = normalize(query);
    if (!term) return [];
    return profiles.filter((profile) =>
      [profile.firstName, profile.city, profile.meetingPlace]
        .filter(Boolean)
        .some((field) => normalize(field).includes(term))
    );
  }, [profiles, query]);

  const showingRecentlyViewed = query.trim().length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="İlan ara"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--site-accent-strong)] transition-colors hover:bg-[var(--site-card-bg)]"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--site-bg)]">
          <div className="flex items-center gap-2 border-b border-[var(--site-border)] bg-[var(--site-header-bg)] px-4 py-3">
            <svg
              className="h-5 w-5 shrink-0 text-[var(--site-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="İsim, semt veya buluşma yeri ara..."
              className="min-w-0 flex-1 bg-transparent text-base text-[var(--site-text)] outline-none placeholder:text-[var(--site-muted)]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Aramayı kapat"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--site-muted)] transition-colors hover:bg-[var(--site-card-bg)] hover:text-[var(--site-accent-strong)]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4">
            {showingRecentlyViewed ? (
              recentlyViewed.length > 0 ? (
                <>
                  <h2 className="px-2 text-sm font-semibold text-[var(--site-text)]">
                    Daha önce gezdikleriniz
                  </h2>
                  <div className="mt-3">
                    <ProfileGrid
                      profiles={recentlyViewed}
                      listName="Arama - Daha Önce Gezdikleriniz"
                    />
                  </div>
                </>
              ) : (
                <p className="px-2 text-sm text-[var(--site-muted)]">
                  Aramak için bir isim, semt veya buluşma yeri yazın.
                </p>
              )
            ) : results.length > 0 ? (
              <ProfileGrid profiles={results} listName="Arama Sonuçları" />
            ) : (
              <p className="px-2 text-sm text-[var(--site-muted)]">
                &quot;{query}&quot; ile eşleşen bir ilan bulunamadı.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
