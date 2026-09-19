"use client";

import Markdown, {type Components} from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({children}) => (
    <h1 className="text-3xl font-bold text-[#CCD6F6] mt-10 mb-4">{children}</h1>
  ),
  h2: ({children}) => (
    <h2 className="text-2xl font-bold text-[#CCD6F6] mt-10 mb-4">{children}</h2>
  ),
  h3: ({children}) => (
    <h3 className="text-xl font-bold text-[#64FFDA] mt-8 mb-3">{children}</h3>
  ),
  p: ({children}) => (
    <p className="text-[#CCD6F6]/80 leading-relaxed mb-5">{children}</p>
  ),
  a: ({href, children}) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#64FFDA] hover:underline"
    >
      {children}
    </a>
  ),
  ul: ({children}) => (
    <ul className="list-disc list-inside space-y-2 mb-5 text-[#CCD6F6]/80">
      {children}
    </ul>
  ),
  ol: ({children}) => (
    <ol className="list-decimal list-inside space-y-2 mb-5 text-[#CCD6F6]/80">
      {children}
    </ol>
  ),
  li: ({children}) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({children}) => (
    <blockquote className="border-l-2 border-[#64FFDA]/50 pl-4 my-6 text-[#8892B0] italic">
      {children}
    </blockquote>
  ),
  strong: ({children}) => (
    <strong className="font-semibold text-[#CCD6F6]">{children}</strong>
  ),
  em: ({children}) => <em className="italic">{children}</em>,
  hr: () => <hr className="border-[#233554] my-8" />,
  img: ({src, alt}) => (
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt || ""}
      loading="lazy"
      decoding="async"
      className="rounded-lg my-6 w-full border border-[#233554]/40"
    />
  ),
  pre: ({children}) => (
    <pre className="bg-[#112240] border border-[#233554] rounded-lg p-4 overflow-x-auto my-6 text-sm">
      {children}
    </pre>
  ),
  code: ({className, children}) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return (
        <code className="font-mono text-sm text-[#CCD6F6]">{children}</code>
      );
    }
    return (
      <code className="font-mono text-[#64FFDA] bg-[#233554]/40 px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  },
  table: ({children}) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left border-collapse text-[#CCD6F6]/80">
        {children}
      </table>
    </div>
  ),
  th: ({children}) => (
    <th className="border border-[#233554] px-3 py-2 font-semibold text-[#CCD6F6]">
      {children}
    </th>
  ),
  td: ({children}) => (
    <td className="border border-[#233554] px-3 py-2">{children}</td>
  ),
};

interface PostBodyProps {
  value: string;
}

export const PostBody = ({value}: PostBodyProps) => {
  return (
    <div className="post-body">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {value}
      </Markdown>
    </div>
  );
};
