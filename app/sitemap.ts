import { MetadataRoute } from "next";
import { LANDING_PAGES } from "@/lib/landing-pages";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://printable-label-maker-moltcorporation.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages = LANDING_PAGES.map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...landingPages,
  ];
}
