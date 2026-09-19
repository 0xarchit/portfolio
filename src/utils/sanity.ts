import { BlogPost, BlogPostFull } from "@/types/api";

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "";
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "v2026-09-19";

const LIST_PROJECTION =
  '{ "id": _id, title, "slug": slug.current, excerpt, "coverImage": coverImage.asset->url, publishedAt, tags }';
const POST_PROJECTION =
  '{ "id": _id, title, "slug": slug.current, excerpt, "coverImage": coverImage.asset->url, publishedAt, tags, body }';

interface SanityPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  tags?: string[];
  body?: string;
}

function mapSanityPost(doc: SanityPost): BlogPost {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt || "",
    coverImage: doc.coverImage,
    date: doc.publishedAt || "",
    tags: doc.tags || [],
  };
}

async function runQuery<T>(
  groq: string,
  params?: Record<string, string>
): Promise<T | null> {
  if (!PROJECT_ID) {
    return null;
  }
  const url = new URL(
    `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}`
  );
  url.searchParams.set("query", groq);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }
  }
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.result as T;
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  const groq = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${LIST_PROJECTION}`;
  const result = await runQuery<SanityPost[]>(groq);
  return (result || []).map(mapSanityPost);
}

export async function getTopPosts(limit: number): Promise<BlogPost[]> {
  const groq = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...${limit}] ${LIST_PROJECTION}`;
  const result = await runQuery<SanityPost[]>(groq);
  return (result || []).map(mapSanityPost);
}

export async function getPost(slug: string): Promise<BlogPostFull | null> {
  const groq = `*[_type == "post" && slug.current == $slug][0] ${POST_PROJECTION}`;
  const result = await runQuery<SanityPost | null>(groq, { slug });
  if (!result) {
    return null;
  }
  return {
    ...mapSanityPost(result),
    body: typeof result.body === "string" ? result.body : "",
  };
}
