export const runtime = 'edge';

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { AnimatedCursor } from "@/components/AnimatedCursor";
import { Footer } from "@/components/Footer";
import { Project, SkillCategory } from "@/types/api";

async function getData() {
  const apiUrl = process.env.DATA_API_URL;
  
  try {
    const [skillsRes, projectsRes] = await Promise.all([
      fetch(`${apiUrl}/v1/skills`, { cache: 'no-store' }),
      fetch(`${apiUrl}/v1/projects`, { cache: 'no-store' })
    ]);

    if (!skillsRes.ok || !projectsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const skills: SkillCategory[] = await skillsRes.json();
    const projects: Project[] = await projectsRes.json();

    return { skills, projects };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { skills: [], projects: [] };
  }
}

export default async function Home() {
  const { skills, projects } = await getData();

  return (
    <>
      <AnimatedCursor />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills skills={skills} />
        <Projects projects={projects} />
      </main>
      <Footer />
    </>
  );
}

