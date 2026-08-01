import type { Profile } from "@/lib/profiles";
import { CATEGORIES, type Category } from "@/lib/categories";

// Profilin girdiği kategoriler. Hem sayfada iç link vermek hem de benzer
// ilanları seçmek için kullanılır.
export function categoriesOf(profile: Profile): Category[] {
  return CATEGORIES.filter((category) => category.filter(profile));
}

// Benzer ilanlar: önce aynı kategorileri paylaşanlar, sonra yaşı en yakın
// olanlar. Rastgele seçmek yerine deterministik sıralıyoruz ki her istekte
// aynı sonuç dönsün ve arama motoru kararlı bir iç link ağı görsün.
export function findRelated(
  profile: Profile,
  pool: Profile[],
  limit = 6
): Profile[] {
  const own = new Set(categoriesOf(profile).map((c) => c.slug));

  return pool
    .filter((candidate) => candidate.id !== profile.id)
    .map((candidate) => {
      const shared = categoriesOf(candidate).filter((c) =>
        own.has(c.slug)
      ).length;
      return {
        candidate,
        shared,
        ageGap: Math.abs((candidate.age ?? 0) - (profile.age ?? 0)),
      };
    })
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.ageGap - b.ageGap ||
        a.candidate.firstName.localeCompare(b.candidate.firstName, "tr")
    )
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
