"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { DynamicIcon } from "./DynamicIcon";
import { BlogPost } from "@/types/api";

interface BlogProps {
  posts: BlogPost[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const Blog = ({ posts }: BlogProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const featured = posts.slice(0, 3);

  return (
    <section id="blog" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#64FFDA]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 text-[#64FFDA] text-xs font-medium mb-6">
            <DynamicIcon name="PenLine" className="w-3 h-3" />
            <span>From the Blog</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6]">
            Latest <span className="text-[#64FFDA]">Writing</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-6"
        >
          {featured.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md flex-grow-0 flex-shrink-0"
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 border border-[#64FFDA]/50 rounded-lg font-mono font-medium transition-all hover:-translate-y-1"
          >
            Read more articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
