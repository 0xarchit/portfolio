"use client";
import { PageLayout } from "@/components/PageLayout";
import { Mail, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";

export default function ContactUs() {
  const contactLinks = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "mail@0xarchit.is-a.dev",
      href: "mailto:mail@0xarchit.is-a.dev",
      description: "Direct email for inquiries",
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      value: "@0xarchit",
      href: "https://github.com/0xarchit",
      description: "Check out my code and projects",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: "LinkedIn (Personal)",
      value: "in/0xarchit",
      href: "https://linkedin.com/in/0xarchit",
      description: "Connect with me professionally",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: "LinkedIn (Company)",
      value: "0xarchit-projects",
      href: "https://www.linkedin.com/company/0xarchit-projects",
      description: "Follow my projects and updates",
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      label: "X (Twitter)",
      value: "@0xarchit",
      href: "https://x.com/0xarchit",
      description: "Follow for tech insights and updates",
    },
    {
      icon: <ExternalLink className="w-6 h-6" />,
      label: "Website",
      value: "0xarchit.is-a.dev",
      href: "https://0xarchit.is-a.dev",
      description: "Visit my portfolio website",
    },
    {
      icon: <ExternalLink className="w-6 h-6" />,
      label: "Carrd",
      value: "0xarchit.carrd.co",
      href: "https://0xarchit.carrd.co",
      description: "Alternative portfolio page",
    },
  ];

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with 0xArchit for collaborations, inquiries, or just to say hello!"
    >
      <div className="space-y-8 mt-8">
        <section>
          <p className="text-[#CCD6F6] text-lg leading-relaxed mb-8">
            Whether you have a project in mind, want to collaborate, or just
            want to connect, feel free to reach out through any of the platforms
            below. I'm always excited to discuss new opportunities and ideas!
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-[#112240] rounded-lg border border-[#233554] hover:border-[#64FFDA] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-[#64FFDA]/10"
            >
              <div className="flex items-start gap-4">
                <div className="text-[#64FFDA] group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[#CCD6F6] font-semibold mb-1 group-hover:text-[#64FFDA] transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-[#64FFDA] text-sm mb-2 font-mono">
                    {link.value}
                  </p>
                  <p className="text-[#8892B0] text-sm">{link.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8892B0] group-hover:text-[#64FFDA] transition-colors" />
              </div>
            </a>
          ))}
        </section>

        <section className="mt-12 p-6 bg-[#0A192F] rounded-lg border border-[#233554]">
          <h2 className="text-2xl font-bold text-[#CCD6F6] mb-4">
            Preferred Contact Method
          </h2>
          <p className="text-[#8892B0] leading-relaxed">
            For business inquiries and project discussions, please email me
            directly at{" "}
            <a
              href="mailto:mail@0xarchit.is-a.dev"
              className="text-[#64FFDA] hover:underline font-mono"
            >
              mail@0xarchit.is-a.dev
            </a>
            . I typically respond within 24-48 hours.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
