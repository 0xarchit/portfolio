"use client";
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';
import { AboutProfile } from '@/types/api';

interface HeaderProps {
  about?: AboutProfile;
}

export const Header = ({ about }: HeaderProps) => {
  const links = about?.links || {};
  const displayName = about?.firstname || about?.username || 'Profile';
  const socialLinks = [
    { key: 'github', href: links.github, icon: <Github className="w-5 h-5"><title>GitHub Icon</title></Github>, label: "GitHub Profile" },
    { key: 'linkedin', href: links.linkedin, icon: <Linkedin className="w-5 h-5"><title>LinkedIn Icon</title></Linkedin>, label: "LinkedIn Profile" },
    { key: 'twitter', href: links.twitter, icon: <Twitter className="w-5 h-5"><title>Twitter Icon</title></Twitter>, label: "Twitter Profile" },
    { key: 'email', href: links.email, icon: <Mail className="w-5 h-5"><title>Email Icon</title></Mail>, label: "Email Contact" },
  ].filter((link) => Boolean(link.href));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#0A192F]/80 border-b border-[#233554]">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link href="/" className="text-2xl font-bold text-[#64FFDA]">
              {displayName}
            </Link>
          </motion.div>
          <div className="flex items-center gap-4 md:gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
