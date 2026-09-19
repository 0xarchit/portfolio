"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[#CCD6F6]/80 leading-relaxed mb-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-[#CCD6F6] mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-[#64FFDA] mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#64FFDA]/50 pl-4 my-6 text-[#8892B0] italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-5 text-[#CCD6F6]/80">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-5 text-[#CCD6F6]/80">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#64FFDA] hover:underline"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[#64FFDA] bg-[#233554]/40 px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => (
      <img
        src={value?.url}
        alt={value?.alt || ""}
        loading="lazy"
        decoding="async"
        className="rounded-lg my-6 w-full border border-[#233554]/40"
      />
    ),
  },
};

interface PostBodyProps {
  value: PortableTextBlock[];
}

export const PostBody = ({ value }: PostBodyProps) => {
  return (
    <div className="post-body">
      <PortableText value={value} components={components} />
    </div>
  );
};
