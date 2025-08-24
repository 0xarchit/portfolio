import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Bot, GraduationCap, Search, BotIcon, FileSearch } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ComingSoonModal } from './ComingSoonModal';

const projects = [
  {
    title: 'AI Classroom Assistant',
    description: 'This project integrates emotion detection, voice-to-text, AI processing, and text-to-voice capabilities into a web-based teaching assistant system. Powered by FastAPI and  self trained LLaMA 3.1 3B.',
    icon: BotIcon,
    color: 'pink',
    git: 'https://github.com/0xarchit/Classroom_AI_Assistant',
    docs: 'https://docs.0xarchit.is-a.dev/aiclassroomassistant',
    demo: '#'
  },
  {
    title: 'DuckDuckGo Content Scraper',
    description: 'Web scraping toolkit with Python and Cloudflare Worker—uses DuckDuckGo, Jina AI, Groq LLM, and GetPantry for dynamic search, storage, extraction, and analysis.',
    icon: FileSearch,
    color: 'pink',
    git: 'https://github.com/0xarchit/duckduckgo-webscraper',
    docs: 'https://docs.0xarchit.is-a.dev/webscraper',
    demo: 'https://duckduckgo-webscraper.onrender.com'
  },
  {
    title: 'AI News Verification',
    description: 'Advanced system for verifying news authenticity using AI and RAG. Features real-time fact-checking and source verification.',
    icon: Search,
    color: 'pink',
    git: 'https://github.com/0xarchit/news-verification-system',
    docs: 'https://docs.0xarchit.is-a.dev/fakenews',
    demo: 'https://news-verify.0xarchit.is-a.dev'
  },
  {
    title: 'LearnTrack',
    description: 'LearnTrack is a comprehensive learning management system designed for educational institutions with role-based access for students, faculty, and administrators.',
    icon: GraduationCap,
    color: 'purple',
    git: 'https://github.com/0xarchit/LearnTrack',
    docs: 'https://docs.0xarchit.is-a.dev/learntrack',
    demo: 'https://learntrack.pages.dev'
  },
  {
    title: 'Scroll2PDF',
    description: 'Transform lengthy web content into well-formatted PDF documents with a single click. Built with advanced PDF processing algorithms.',
    icon: ScrollText,
    color: 'blue',
    git: 'https://github.com/0xarchit/Scroll-To-Pdf',
    docs: 'https://docs.0xarchit.is-a.dev/scroll2pdf',
    demo: 'https://github.com/0xarchit/Scroll-To-Pdf/releases/tag/1.0.0'
  },
  {
    title: 'CodeArc',
    description: 'Next-generation AI chat Bot for coding assistance with advanced context understanding. Features real-time responses and memory management.',
    icon: Bot,
    color: 'teal',
    git: 'https://github.com/0xarchit/CodeArc',
    docs: 'https://docs.0xarchit.is-a.dev/codearc',
    demo: 'https://codearc.0xarchit.is-a.dev'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">            {projects.map((project) => {
              const handleDemoClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                if (project.demo === '#') {
                  e.preventDefault();
                  setShowComingSoonModal(true);
                }
              };
              const handleGitClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                if (project.git === '#') {
                  e.preventDefault();
                  setShowComingSoonModal(true);
                }
              };
              return (
                <ProjectCard 
                  key={project.title} 
                  {...project} 
                  onDemoClick={handleDemoClick}
                  onGitClick={handleGitClick}
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
