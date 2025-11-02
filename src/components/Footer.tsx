"use client";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/0xarchit",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/in/0xarchit",
      label: "LinkedIn",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://x.com/0xarchit",
      label: "X (Twitter)",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:mail@0xarchit.is-a.dev",
      label: "Email",
    },
  ];

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
          {/* About Section */}
          <div>
            <h3 className="text-[#64FFDA] font-bold text-xl mb-4">0xArchit</h3>
            <p className="text-[#8892B0] text-sm leading-relaxed">
              Passionate programmer and student, building innovative solutions.
            </p>
          </div>

          {/* Quick Links */}
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

          {/* Social Links */}
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
              <a
                href="https://0xarchit.carrd.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8892B0] hover:text-[#64FFDA] transition-colors text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Alternative Portfolio
              </a>
              <a
                href="https://www.linkedin.com/company/0xarchit-projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8892B0] hover:text-[#64FFDA] transition-colors text-sm flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                Company Page
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#233554] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8892B0] text-sm">
            © {currentYear} 0xArchit (Archit Jain). All rights reserved.
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
