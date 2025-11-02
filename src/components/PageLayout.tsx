"use client";
import { Header } from "./Header";
import { AnimatedCursor } from "./AnimatedCursor";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <>
      <AnimatedCursor />
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#64FFDA] hover:underline mb-8 transition-all hover:gap-3"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#64FFDA] to-[#CCD6F6] bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-[#8892B0] text-lg mb-8">{description}</p>
            )}

            <div className="prose prose-invert prose-lg max-w-none">
              {children}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
