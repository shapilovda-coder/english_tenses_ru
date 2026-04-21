import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://xn--80aaebgia2ajkigjfdvu4a.xn--p1ai/sitemap.xml",
  };
}
