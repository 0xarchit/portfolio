import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Bot, Globe, Search } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ComingSoonModal } from './ComingSoonModal';

const projects = [
  {
    title: 'Scroll2PDF',
    description: 'Transform lengthy web content into well-formatted PDF documents with a single click. Built with advanced PDF processing algorithms.',
    icon: ScrollText,
    color: 'blue',
    github: 'https://github.com/0xarchit/Scroll-To-Pdf',
    demo: 'https://github.com/bitbotsofficial/Scroll-To-Pdf/releases/tag/1.0.0'
  },
  {
    title: 'CodeArc',
    description: 'Next-generation AI chat Bot for coding assistance with advanced context understanding. Features real-time responses and memory management.',
    icon: Bot,
    color: 'teal',
    github: 'https://github.com/0xarchit',
    demo: 'https://codearc.pages.dev'
  },
  {
    title: 'Portfolio Website',
    description: 'A modern, interactive portfolio showcasing my projects and skills. Built with React, Framer Motion, and Tailwind CSS.',
    icon: Globe,
    color: 'purple',
    github: 'https://github.com/0xarchit',
    demo: 'https://0xarchit.is-a.dev'
  },
  {
    title: 'AI News Verification',
    description: 'Advanced system for verifying news authenticity using AI and machine learning. Features real-time fact-checking and source verification.',
    icon: Search,
    color: 'pink',
    github: 'https://github.com/0xarchit',
    demo: '#'
  }
];

export const Projects = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  return (
    <>
      <section id="projects" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project) => {
              const handleDemoClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                if (project.demo === '#') {
                  e.preventDefault();
                  setShowComingSoonModal(true);
                }
              };
              return (
                <ProjectCard 
                  key={project.title} 
                  {...project} 
                  onDemoClick={handleDemoClick} 
                />
              );
            })}
          </div>
        </div>
      </section>
      {showComingSoonModal && (
        <ComingSoonModal onClose={() => setShowComingSoonModal(false)} />
      )}
    </>
  );
};