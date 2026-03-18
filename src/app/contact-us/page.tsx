import { PageLayout } from "@/components/PageLayout";
import { Contact } from "@/components/Contact";
import { Mail, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import { AllPortfolioData } from "@/types/api";

const cleanValue = (value?: string) =>
  (value || "").replace(/`/g, "").trim();

async function getAllData(): Promise<AllPortfolioData | null> {
  const apiUrl = process.env.DATA_API_URL || "https://0xarchit.val.run";
  try {
    const res = await fetch(`${apiUrl}/v1/all`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return null;
    }
    const data: AllPortfolioData = await res.json();
    return {
      ...data,
      about: {
        ...data.about,
        links: Object.fromEntries(
          Object.entries(data.about?.links || {}).map(([key, value]) => [
            key,
            cleanValue(value),
          ])
        ),
      },
    };
  } catch {
    return null;
  }
}

export default async function ContactUs() {
  const data = await getAllData();
  const about = data?.about;

  const iconByKey: Record<string, JSX.Element> = {
    email: <Mail className="w-6 h-6" />,
    github: <Github className="w-6 h-6" />,
    linkedin: <Linkedin className="w-6 h-6" />,
    twitter: <Twitter className="w-6 h-6" />,
  };

  const labelByKey: Record<string, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "X (Twitter)",
    email: "Email",
    docs: "Documentation",
    leetcode: "LeetCode",
    codolio: "Codolio",
    peerlist: "Peerlist",
    portfolio_secondary: "Secondary Portfolio",
    card: "Card",
    resume: "Resume",
  };

  const contactLinks = Object.entries(about?.links || {})
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({
      key,
      icon: iconByKey[key] || <ExternalLink className="w-6 h-6" />,
      label: labelByKey[key] || key.replace(/_/g, " "),
      value: href.replace(/^mailto:/, ""),
      href,
      description: `${labelByKey[key] || key} link from API`,
    }));

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with 0xArchit for collaborations, inquiries, or just to say hello!"
      about={about}
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
          {contactLinks.map((link) => (
            <a
              key={link.key}
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

        <section className="mt-12">
          <Contact />
        </section>
      </div>
    </PageLayout>
  );
}
