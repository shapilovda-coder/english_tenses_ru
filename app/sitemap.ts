import { topics } from "@/content/topics";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xn--80aaebgia2ajkigjfdvu4a.xn--p1ai";

  return [
    ...topics.map((topic) => ({ url: `${baseUrl}/${topic.slug}/`, lastModified: new Date("2026-11-05T00:00:00Z"), changeFrequency: "monthly" as const, priority: 0.8 })),
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contacts/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
