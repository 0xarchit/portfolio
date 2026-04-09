"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { ComingSoonModal } from "./ComingSoonModal";
import { Project } from "../types/api";
import { DynamicIcon } from "./DynamicIcon";

interface ProjectsProps {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const Projects = ({ projects }: ProjectsProps) => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <section id="projects" className="py-20 md:py-32 relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#64FFDA]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 text-[#64FFDA] text-xs font-medium mb-6">
               <DynamicIcon name="MonitorSmartphone" className="w-3 h-3" />
               <span>Some Things I've Built</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6]">
              Featured <span className="text-[#64FFDA]">Projects</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {projects.slice(0, showAll ? projects.length : 3).map((project, index) => {
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
                <motion.div 
                  key={`${project.id || project.title}-${index}`} 
                  variants={itemVariants} 
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="break-inside-avoid h-full"
                  layout
                >
                  <ProjectCard
                    title={project.title}
                    description={project.desc}
                    iconName={project.icon}
                    git={project.links.github}
                    docs={project.links.docs}
                    demo={project.links.demo}
                    tech={project.tech}
                    onDemoClick={handleDemoClick}
                    onGitClick={handleGitClick}
                  />
                </motion.div>
              );
            })}
          </motion.div>
          
          {projects.length > 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center mt-12 md:mt-16"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 border border-[#64FFDA]/50 rounded-lg font-mono font-medium transition-all hover:-translate-y-1 relative group overflow-hidden"
              >
                <span className="relative z-10">
                  {showAll ? "Show Less" : "View Full Archive"}
                </span>
                <div className="absolute inset-0 bg-[#64FFDA]/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
      {showComingSoonModal && (
        <ComingSoonModal onClose={() => setShowComingSoonModal(false)} />
      )}
    </>
  );
};
