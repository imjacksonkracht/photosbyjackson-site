import type { MetadataRoute } from "next";
import { categoryOrder, projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/about", "/contact", ...categoryOrder.map((c) => `/work/${c}`)];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      ...(p.date ? { lastModified: p.date } : {}),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
