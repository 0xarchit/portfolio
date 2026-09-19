export const runtime = "edge";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PostBody } from "@/components/PostBody";
import { AboutProfile } from "@/types/api";
import { getPost } from "@/utils/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value: string): string {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post not found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, about] = await Promise.all([getPost(slug), getAbout()]);

  if (!post) {
    notFound();
  }

  const formattedDate = formatDate(post.date);

  return (
    <PageLayout title={post.title} description={post.excerpt} about={about}>
      <div className="flex flex-wrap items-center gap-3 mb-8 text-sm font-mono text-[#64FFDA]">
        {formattedDate && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
        )}
        {post.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          loading="eager"
          decoding="async"
          className="rounded-xl w-full mb-10 border border-[#233554]/40"
        />
      )}

      <PostBody value={post.body} />
    </PageLayout>
  );
}
