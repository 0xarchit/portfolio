"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';
import { AboutProfile } from '@/types/api';

interface HeaderProps {
  about?: AboutProfile;
}

export const Header = ({ about }: HeaderProps) => {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0.8, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 50], ["8px", "16px"]);
  const headerBorder = useTransform(scrollY, [0, 50], ["rgba(35, 53, 84, 0)", "rgba(35, 53, 84, 1)"]);
  
  const links = about?.links || {};
  const displayName = about?.firstname || about?.username || 'Profile';
  const socialLinks = [
    { key: 'github', href: links.github, icon: <Github className="w-5 h-5"><title>GitHub Icon</title></Github>, label: "GitHub Profile" },
    { key: 'linkedin', href: links.linkedin, icon: <Linkedin className="w-5 h-5"><title>LinkedIn Icon</title></Linkedin>, label: "LinkedIn Profile" },
    { key: 'twitter', href: links.twitter, icon: <Twitter className="w-5 h-5"><title>Twitter Icon</title></Twitter>, label: "Twitter Profile" },
    { key: 'email', href: links.email, icon: <Mail className="w-5 h-5"><title>Email Icon</title></Mail>, label: "Email Contact" },
  ].filter((link) => Boolean(link.href));

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]"
      style={{ 
        opacity: headerOpacity, 
        backdropFilter: `blur(${headerBlur})`,
        borderBottom: `1px solid ${headerBorder}` 
      }}
    >
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#64FFDA] to-[#CCD6F6]/60 hover:from-[#64FFDA] hover:to-[#64FFDA] transition-all duration-300">
              {displayName}
              <span className="text-[#64FFDA]">.</span>
            </Link>
          </motion.div>
          <div className="flex items-center gap-4 md:gap-6">
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5, y: -2 }}
                className="text-[#8892B0] hover:text-[#64FFDA] p-2 hover:bg-[#64FFDA]/10 rounded-lg transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
