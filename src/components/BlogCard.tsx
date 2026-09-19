"use client";

import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { BlogPost } from "@/types/api";

interface BlogCardProps {
  post: BlogPost;
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
    month: "short",
    day: "numeric",
  });
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = formatDate(post.date);

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <GlassCard className="h-full flex flex-col p-6 md:p-8 backdrop-blur-lg border-[#233554]/50 hover:border-[#64FFDA]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-15px_rgba(100,255,218,0.15)] group">
        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6 bg-[#020C1B] border border-[#233554]/40">
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4 text-xs font-mono text-[#64FFDA]">
          {formattedDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          )}
          {post.readingTime && <span>{post.readingTime}</span>}
        </div>

        <h3 className="text-2xl font-bold text-[#CCD6F6] mb-3 group-hover:text-[#64FFDA] transition-colors flex items-start gap-2">
          <span className="flex-grow">{post.title}</span>
          <ArrowUpRight className="w-5 h-5 shrink-0 mt-1 text-[#8892B0] group-hover:text-[#64FFDA] transition-colors" />
        </h3>

        {post.excerpt && (
          <p className="text-[#8892B0] mb-6 leading-relaxed flex-grow">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-[#64FFDA]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </Link>
  );
};
