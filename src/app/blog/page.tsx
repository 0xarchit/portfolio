export const runtime = "edge";

import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BlogCard } from "@/components/BlogCard";
import { AboutProfile } from "@/types/api";
import { getPosts } from "@/utils/sanity";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, notes, and writing.",
};

async function getAbout(): Promise<AboutProfile | undefined> {
  const apiUrl = process.env.DATA_API_URL || "https://0xarchit.val.run";
  try {
    const res = await fetch(`${apiUrl}/v1/all`, { next: { revalidate: 300 } });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();
    return data.about;
  } catch {
    return undefined;
  }
}

export default async function BlogIndex() {
  const [posts, about] = await Promise.all([getPosts(), getAbout()]);

  return (
    <PageLayout title="Blog" description="Articles, notes, and writing." about={about}>
      {posts.length === 0 ? (
        <p className="text-[#8892B0]">No posts published yet. Check back soon.</p>
      ) : (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="break-inside-avoid">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
