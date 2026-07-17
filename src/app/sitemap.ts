import type { MetadataRoute } from "next";
import { getProfiles } from "@/lib/profiles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pendikescortt.com";

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
