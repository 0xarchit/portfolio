"use client";
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#0A192F]/80 border-b border-[#233554]">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link href="/" className="text-2xl font-bold text-[#64FFDA]">
              Archit
            </Link>
          </motion.div>
          <div className="flex items-center gap-4 md:gap-6">
            <motion.a
              href="https://github.com/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5">
                <title>GitHub Icon</title>
              </Github>
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/0xarchit/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5">
                <title>LinkedIn Icon</title>
              </Linkedin>
            </motion.a>
            <motion.a
              href="https://x.com/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-5 h-5">
                <title>Twitter Icon</title>
              </Twitter>
            </motion.a>
            <motion.a
              href="mailto:mail@0xarchit.is-a.dev"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors"
              aria-label="Email Contact"
            >
              <Mail className="w-5 h-5">
                <title>Email Icon</title>
              </Mail>
            </motion.a>
          </div>
        </div>
      </div>
    </nav>
  );
};