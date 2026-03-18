"use client";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
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
    <footer className="bg-[#0A192F] border-t border-[#233554] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
            <h3 className="text-[#64FFDA] font-bold text-xl mb-4">{brand}</h3>
            <p className="text-[#8892B0] text-sm leading-relaxed">
              {brandDescription}
            </p>
          </div>

                    <div>
            <h3 className="text-[#CCD6F6] font-bold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#8892B0] hover:text-[#64FFDA] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

                    <div>
            <h3 className="text-[#CCD6F6] font-bold text-lg mb-4">Connect</h3>
            <div className="flex gap-4 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8892B0] hover:text-[#64FFDA] transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="space-y-2">
              {extraLinks.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8892B0] hover:text-[#64FFDA] transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {linkLabels[key] || key.replace(/_/g, " ")}
                </a>
              ))}
            </div>
          </div>
        </div>

                <div className="border-t border-[#233554] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8892B0] text-sm">
            © {currentYear} {brand} ({fullName}). All rights reserved.
          </p>
          <p className="text-[#8892B0] text-sm">
            Made with <span className="text-[#64FFDA]">❤</span> using Next.js &
            Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
