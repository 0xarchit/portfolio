import type { MetadataRoute } from "next";
import { getPosts } from "@/utils/sanity";
import type { AllPortfolioData } from "@/types/api";

export const runtime = "edge";
export const revalidate = 300;

const BASE_URL = "https://0xarchit.is-a.dev";
const SITE_UPDATED = "2026-09-23";

async function getProjectUrls(): Promise<string[]> {
  const apiUrl = process.env.DATA_API_URL || "https://0xarchit.val.run";
  try {
    const res = await fetch(`${apiUrl}/v1/all`, { next: { revalidate: 300 } });
    if (!res.ok) {
      return [];
    }
    const data: AllPortfolioData = await res.json();
    const seen = new Set<string>();
    for (const project of data.projects || []) {
      const demo = (project.links?.demo || "").replace(/`/g, "").trim();
      if (/^https?:\/\//.test(demo)) {
        seen.add(demo);
      }
    }
    return [...seen];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projectUrls] = await Promise.all([getPosts(), getProjectUrls()]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: SITE_UPDATED, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact-us`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date || SITE_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = projectUrls.map((url) => ({
    url,
    lastModified: SITE_UPDATED,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries, ...projectEntries];
}
