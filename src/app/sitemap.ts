import type { MetadataRoute } from "next";
import { getProfiles, isProfileActive } from "@/lib/profiles";
import {
  CATEGORIES,
  applyCategory,
  MIN_INDEXABLE_PROFILES,
} from "@/lib/categories";
import { profilePath } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

// Sitemap build anında dondurulursa yeni eklenen ilanlar Google'a hiç
// bildirilmez. Saatte bir yeniden üretiyoruz.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Süresi dolan ilanlar sitemap'e girmemeli; aksi halde Google'a artık
  // indekslenmeyen URL'ler bildirilir ve tarama bütçesi boşa harcanır.
  const profiles = (await getProfiles()).filter(isProfileActive);
  const lastModified = new Date();

  // İçi yeterince dolmamış kategoriler noindex olduğu için sitemap'e de
  // girmez; sitemap ile robots meta etiketi birbiriyle tutarlı kalmalı.
  const categoryEntries = CATEGORIES.filter(
    (category) =>
      applyCategory(category, profiles).length >= MIN_INDEXABLE_PROFILES
  ).map((category) => ({
    url: `${siteUrl}/${category.slug}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...profiles.map((profile) => {
      const createdAt = new Date(profile.createdAt);
      return {
        url: `${siteUrl}${profilePath(profile)}`,
        lastModified: Number.isNaN(createdAt.getTime()) ? lastModified : createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }),
  ];
}
