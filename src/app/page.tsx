"use client";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { AnimatedCursor } from "@/components/AnimatedCursor";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AnimatedCursor />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
      </main>
      <Footer />
    </>
  );
}

