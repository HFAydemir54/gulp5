export type RecentlyViewedProfile = {
  id: string;
  firstName: string;
  city: string;
  meetingPlace: string;
  image: string | null;
  expiresAt: string;
};

const STORAGE_KEY = "recentlyViewedProfiles";
const MAX_ENTRIES = 10;

function isExpired(profile: RecentlyViewedProfile): boolean {
  if (!profile.expiresAt) return false;
  return Date.now() >= new Date(profile.expiresAt).getTime();
}

export function getRecentlyViewed(): RecentlyViewedProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as RecentlyViewedProfile[]) : [];
    const active = parsed.filter((item) => !isExpired(item));
    // Süresi dolan kayıtlar depoda kalıp yer kaplamasın diye saklanan
    // listeyi de temizlenmiş haliyle geri yazıyoruz.
    if (active.length !== parsed.length) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
      } catch {
        // localStorage dolu/kapalı olabilir, sessizce yok say.
      }
    }
    return active;
  } catch {
    return [];
  }
}

export function addRecentlyViewed(profile: RecentlyViewedProfile): void {
  if (typeof window === "undefined") return;
  const existing = getRecentlyViewed().filter((item) => item.id !== profile.id);
  const updated = [profile, ...existing].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage dolu/kapalı olabilir, sessizce yok say.
  }
}
