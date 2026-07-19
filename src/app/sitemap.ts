import type { MetadataRoute } from "next";
import { getProfiles } from "@/lib/profiles";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await getProfiles();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...profiles.map((profile) => ({
      url: `${siteUrl}/users/${profile.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
