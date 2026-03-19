import type { MetadataRoute } from "next";
import { CONCEPTS } from "@/data/concepts";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nuuncreative.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const conceptPages = CONCEPTS.map((c) => ({
    url: `${BASE_URL}/concepts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/manifesto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/concepts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...conceptPages,
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
