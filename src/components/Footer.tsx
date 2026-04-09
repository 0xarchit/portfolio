"use client";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink, Heart } from "lucide-react";
import { AboutProfile } from "@/types/api";

interface FooterProps {
  about?: AboutProfile;
}

export function Footer({ about }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const links = about?.links || {};
  const brand = about?.username || "Profile";
  const fullName =
    about?.firstname && about?.lastname
      ? `${about.firstname} ${about.lastname}`
      : "Developer";
  const brandDescription =
    about?.bio || "Building innovative solutions.";

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      href: links.github,
      label: "GitHub",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: links.linkedin,
      label: "LinkedIn",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: links.twitter,
      label: "X (Twitter)",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: links.email,
      label: "Email",
    },
  ].filter((item) => Boolean(item.href));

  const linkLabels: Record<string, string> = {
    docs: "Documentation",
    leetcode: "LeetCode",
    codolio: "Codolio",
    peerlist: "Peerlist",
    portfolio_secondary: "Secondary Portfolio",
    card: "Card Link",
    resume: "Resume",
  };

  const extraLinks = Object.entries(links).filter(
    ([key, value]) =>
      !["github", "linkedin", "twitter", "email"].includes(key) && Boolean(value)
  );

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact-us" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <footer className="bg-[#0A192F] relative mt-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#64FFDA]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#64FFDA] to-[#CCD6F6]/60">
              {brand}<span className="text-[#64FFDA]">.</span>
            </h3>
            <p className="text-[#8892B0] text-sm leading-relaxed max-w-xs">
              {brandDescription}
            </p>
          </div>

          <div>
            <h3 className="text-[#CCD6F6] font-bold text-lg mb-6 font-mono">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#8892B0] hover:text-[#64FFDA] transition-all hover:translate-x-1 inline-block text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#CCD6F6] font-bold text-lg mb-6 font-mono">Connect</h3>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8892B0] hover:text-[#64FFDA] hover:-translate-y-1 transition-all p-2 hover:bg-[#64FFDA]/10 rounded-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {extraLinks.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8892B0] hover:text-[#CCD6F6] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#64FFDA]" />
                  {linkLabels[key] || key.replace(/_/g, " ")}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#233554]/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8892B0] text-sm font-mono opacity-80">
            © {currentYear} {brand} ({fullName}).
          </p>
          <p className="text-[#8892B0] text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#64FFDA] fill-[#64FFDA]/20" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
