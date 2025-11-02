"use client";
import { PageLayout } from "@/components/PageLayout";

export default function About() {
  return (
    <PageLayout
      title="About 0xArchit"
      description="Learn more about the developer and the projects"
    >
      <div className="space-y-6 text-[#CCD6F6]">
        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Who is 0xArchit?
          </h2>
          <p className="leading-relaxed mb-4">
            Hi, I'm Archit Jain, also known as{" "}
            <span className="text-[#64FFDA] font-mono">0xArchit</span>, a
            passionate programmer and student based in India. I love exploring
            and learning new technologies, constantly pushing the boundaries of
            what's possible in the digital world.
          </p>
          <p className="leading-relaxed">
            Currently, I'm focused on mastering the MERN Stack, Python, AI
            Implementation, Cyber Security, and Ethical Hacking. By keeping
            myself diverse in the tech field and following my passion, I've
            become a self-taught programmer who enjoys every moment of the
            learning journey.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">What I Do</h2>
          <p className="leading-relaxed mb-4">
            I specialize in building modern web applications, exploring
            cutting-edge technologies, and creating innovative solutions to
            complex problems. My projects range from full-stack web applications
            to AI-powered tools and cybersecurity implementations.
          </p>
          <p className="leading-relaxed">
            When I'm not coding, you'll find me reading about business,
            analyzing the stock market, staying updated on crypto trends, or
            exploring the latest tech news. I believe in continuous learning and
            staying ahead of the curve in this ever-evolving tech landscape.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            My Philosophy
          </h2>
          <p className="leading-relaxed">
            I believe in open-source collaboration, continuous learning, and
            building technology that makes a difference. Every project I create
            is an opportunity to learn something new and contribute to the
            developer community. My goal is to create tools and applications
            that are not only functional but also inspire others to innovate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Technologies I Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "JavaScript/TypeScript",
              "React.js & Next.js",
              "Node.js & Express",
              "MongoDB",
              "Python",
              "AI/ML Implementation",
              "Cyber Security",
              "Git & GitHub",
              "Tailwind CSS",
              "REST APIs",
              "Linux",
              "Ethical Hacking",
            ].map((tech) => (
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
