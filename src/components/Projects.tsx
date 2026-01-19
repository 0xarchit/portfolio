"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { ComingSoonModal } from "./ComingSoonModal";
import { Project } from "../types/api";

interface ProjectsProps {
  projects: Project[];
}

export const Projects = ({ projects }: ProjectsProps) => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <section id="projects" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-[#64FFDA]"
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {" "}
            {projects.slice(0, showAll ? projects.length : 4).map((project) => {
              const handleDemoClick = (
                e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
              ) => {
                if (project.links.demo === "#") {
                  e.preventDefault();
                  setShowComingSoonModal(true);
                }
              };
              const handleGitClick = (
                e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
              ) => {
                if (project.links.github === "#") {
                  e.preventDefault();
                  setShowComingSoonModal(true);
                }
              };
              
              return (
                <ProjectCard
                  key={project.id || project.title}
                  title={project.title}
                  description={project.desc}
                  iconName={project.icon}
                  git={project.links.github}
                  docs={project.links.docs}
                  demo={project.links.demo}
                  onDemoClick={handleDemoClick}
                  onGitClick={handleGitClick}
                />
              );
            })}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 border border-[#64FFDA]/50 rounded-lg font-mono font-medium transition-all hover:-translate-y-1"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </motion.div>
        </div>
      </section>
      {showComingSoonModal && (
        <ComingSoonModal onClose={() => setShowComingSoonModal(false)} />
      )}
    </>
  );
};
