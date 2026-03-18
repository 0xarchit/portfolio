import { PageLayout } from "@/components/PageLayout";
import { AllPortfolioData, SkillCategory } from "@/types/api";

const cleanValue = (value?: string) =>
  (value || "").replace(/`/g, "").trim();

const cleanBackground = (value?: string) =>
  (value || "").replace(/`/g, "").replace(/\r\n/g, "\n").trim();

const renderFormattedBackground = (background?: string) => {
  const blocks = cleanBackground(background)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const bulletLines = lines
      .filter((line) => line.startsWith("•"))
      .map((line) => line.replace(/^•\s*/, ""));
    const textLines = lines.filter((line) => !line.startsWith("•"));

    if (bulletLines.length > 0) {
      return (
        <div key={`bg-${index}`} className="space-y-2">
          {textLines.length > 0 && (
            <p className="leading-relaxed">{textLines.join(" ")}</p>
          )}
          <ul className="list-disc list-inside space-y-1 ml-4">
            {bulletLines.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p key={`bg-${index}`} className="leading-relaxed">
        {textLines.join(" ")}
      </p>
    );
  });
};

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
      projects: (data.projects || []).map((project) => ({
        ...project,
        links: {
          github: cleanValue(project.links?.github),
          docs: cleanValue(project.links?.docs),
          demo: cleanValue(project.links?.demo),
        },
      })),
    };
  } catch {
    return null;
  }
}

export default async function About() {
  const data = await getAllData();
  const about = data?.about;
  const allSkills = (data?.skills || []).flatMap(
    (category: SkillCategory) => category.skills
  );
  const techList = [...new Set(allSkills)].slice(0, 15);

  return (
    <PageLayout
      title={`About ${about?.username || "0xArchit"}`}
      description="Learn more about the developer and the projects"
      about={about}
    >
      <div className="space-y-6 text-[#CCD6F6]">
        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Who is {about?.username || "0xArchit"}?
          </h2>
          <p className="leading-relaxed mb-4">
            Hi, I'm {about?.firstname || "Archit"} {about?.lastname || "Jain"},
            also known as{" "}
            <span className="text-[#64FFDA] font-mono">
              {about?.username || "0xArchit"}
            </span>
            .
          </p>
          <div className="space-y-4">{renderFormattedBackground(about?.background)}</div>
          <p className="leading-relaxed mt-4">{about?.bio}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">Interests</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            {(about?.interests || []).map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Professional Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(about?.links || {}).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#112240] border border-[#233554] rounded px-4 py-2 hover:border-[#64FFDA] transition-colors"
              >
                <span className="text-[#64FFDA] capitalize">{label}</span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Latest Projects Snapshot
          </h2>
          <p className="leading-relaxed mb-4">
            Total projects: {data?.projects?.length || 0}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(data?.projects || []).slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="bg-[#112240] border border-[#233554] rounded px-4 py-2"
              >
                {project.title}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Technologies I Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {techList.map((tech) => (
              <div
                key={tech}
                className="bg-[#112240] border border-[#233554] rounded px-4 py-2 text-center hover:border-[#64FFDA] transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0A192F] p-6 rounded-lg border border-[#233554]">
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Get in Touch
          </h2>
          <p className="leading-relaxed mb-4">
            I'm always open to collaborating on interesting projects, discussing
            new ideas, or just having a chat about technology. Feel free to
            reach out!
          </p>
          <a
            href="/contact-us"
            className="inline-block bg-transparent border-2 border-[#64FFDA] text-[#64FFDA] px-6 py-3 rounded hover:bg-[#64FFDA]/10 transition-all"
          >
            Contact Me
          </a>
        </section>
      </div>
    </PageLayout>
  );
}
