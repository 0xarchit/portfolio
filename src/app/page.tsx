export const runtime = 'edge';

import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutProfile, AllPortfolioData } from "@/types/api";

const AnimatedCursor = dynamic(() =>
  import("@/components/AnimatedCursor").then((mod) => mod.AnimatedCursor)
);
const About = dynamic(() =>
  import("@/components/About").then((mod) => mod.About)
);
const Skills = dynamic(() =>
  import("@/components/Skills").then((mod) => mod.Skills)
);
const Projects = dynamic(() =>
  import("@/components/Projects").then((mod) => mod.Projects)
);
const Footer = dynamic(() =>
  import("@/components/Footer").then((mod) => mod.Footer)
);

const FALLBACK_ABOUT: AboutProfile = {
  firstname: "",
  lastname: "",
  username: "",
  title: "",
  bio: "",
  background: "",
  links: {},
  interests: [],
};

const cleanValue = (value?: string) =>
  (value || "").replace(/`/g, "").trim();

const normalizeAllData = (data: AllPortfolioData): AllPortfolioData => {
  const about = data.about || FALLBACK_ABOUT;
  return {
    ...data,
    about: {
      ...about,
      links: Object.fromEntries(
        Object.entries(about.links || {}).map(([key, value]) => [
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
    skills: data.skills || [],
  };
};

async function getData() {
  const apiUrl = process.env.DATA_API_URL || "https://0xarchit.val.run";
  
  try {
    const allRes = await fetch(`${apiUrl}/v1/all`, {
      next: { revalidate: 300 },
    });

    if (!allRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const allData: AllPortfolioData = await allRes.json();

    return normalizeAllData(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return { about: FALLBACK_ABOUT, skills: [], projects: [] };
  }
}

export default async function Home() {
  const { about, skills, projects } = await getData();

  return (
    <>
      <AnimatedCursor />
      <Header about={about} />
      <main>
        <Hero about={about} />
        <About about={about} />
        <Skills skills={skills} />
        <Projects projects={projects} />
      </main>
      <Footer about={about} />
    </>
  );
}

