import { useState } from "react";
import { motion } from "framer-motion";
import {
  ScrollText,
  Bot,
  GraduationCap,
  Search,
  BotIcon,
  FileSearch,
  Newspaper,
  MessageSquareText,
  Waypoints,
  Gitlab,
  MessageCircleCode,
  Code2,
  Earth,
  MessageCircle,
  ActivitySquare,
  Scale,
  FileSearchIcon,
  AudioLines
} from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ComingSoonModal } from "./ComingSoonModal";

const projects = [
  {
    title: "0xDABmusic",
    description:
      "0xDABmusic isn't just another music player. It's a high-performance, application built with Go and Wails, designed for those who demand quality and privacy. Download, Convert or Enjoy your existing playlist in FLAC quality All in one place",
    icon: AudioLines,

    git: "https://github.com/0xarchit/0xDABmusic",
    docs: "https://docs.0xarchit.is-a.dev/0xdabmusic",
    demo: "https://dab.0xarchit.is-a.dev",
  },
  {
    title: "Bills Sentiment",
    description:
      "Multi-region search testing across Google, Bing, DuckDuckGo, and Yahoo using HTTP/SOCKS4/SOCKS5 proxies with optional Google Programmable Search API, Playwright screenshots, resource-aware parallel browsers, and auto-scaling concurrency.",
    icon: Scale,

    git: "https://github.com/0xarchit/BillsSentiments",
    docs: "https://docs.0xarchit.is-a.dev/billsentiments",
    demo: "#",
  },
  {
    title: "AI Health",
    description:
      "Analyze food instanly using your personal AI quota with zero cost. Includes detailed macro/micro breakdowns, 3D organ risk mapping, medical record storage, and an encrypted profile system.",
    icon: ActivitySquare,

    git: "https://github.com/0xarchit/AI-Health",
    docs: "https://docs.0xarchit.is-a.dev/aihealth",
    demo: "https://aihealth.0xarchit.is-a.dev",
  },
  {
    title: "Global Search Visualizer",
    description:
      "Multi-region search testing across Google, Bing, DuckDuckGo, and Yahoo using HTTP/SOCKS4/SOCKS5 proxies with optional Google Programmable Search API, Playwright screenshots, resource-aware parallel browsers, and auto-scaling concurrency.",
    icon: Earth,

    git: "https://github.com/0xarchit/global-search-visualizer",
    docs: "https://docs.0xarchit.is-a.dev/globalsearchvisualizer",
    demo: "https://global-view.0xarchit.is-a.dev",
  },
  {
    title: "BYOK Chat",
    description:
      "Feature-rich chat platform that lets you bring your own API keys. Includes built-in light, dark, and cyber-aurora themes; local data persistence via IndexedDB; API key testing with selected models; and tools to add, edit, and manage multiple AI providers with custom system prompts plus import/export options.",
    icon: MessageCircle,

    git: "https://github.com/0xarchit/byokchat",
    docs: "https://docs.0xarchit.is-a.dev/byokchat",
    demo: "https://byok.0xarchit.is-a.dev",
  },
  {
    title: "AlgorithmAce",
    description:
      "AlgorithmAce is an AI-powered Chrome extension that enhances LeetCode with problem explanations, friend comparisons, visual analytics, daily challenges, reminders, and motivational insights for smarter, consistent coding practice.",
    icon: Code2,

    git: "https://github.com/0xarchit/AlgorithmAce",
    docs: "https://docs.0xarchit.is-a.dev/algorithmace",
    demo: "https://algorithmace.0xarchit.is-a.dev",
  },
  {
    title: "Chatty - Anywhere Chatbot",
    description:
      "Chatty is a lightweight, drop-in JavaScript widget that adds a floating, context-aware chatbot to any website. The widget is delivered as a single script via Jsdelivr cdn. Chatty supports customizable branding, theme mode, system prompt, and optional page context capture.",
    icon: MessageCircleCode,

    git: "https://github.com/0xarchit/AnyWhere-ChatBot-Chatty",
    docs: "https://docs.0xarchit.is-a.dev/chatty",
    demo: "https://chatty.0xarchit.is-a.dev",
  },
  {
    title: "ArcNews",
    description:
      "ArcNews is a comprehensive, production-style news dashboard designed with a modular, full-stack architecture. It demonstrates the integration of multiple modern technologies to deliver a feature-rich user experience.",
    icon: Newspaper,

    git: "https://github.com/0xarchit/ArcNews-DashBoard",
    docs: "https://docs.0xarchit.is-a.dev/arcnews",
    demo: "https://arcnews.0xarchit.is-a.dev",
  },
  {
    title: "ChatDoc",
    description:
      "ChatDoc is a web application enabling users to upload documents (PDF, TXT, CSV, XLSX, PPTX, DOCX), extract and chunk text, store embeddings in Milvus, and query with state-of-the-art LLMs. It provides both a REST API and a web-based interface for seamless integration.",
    icon: MessageSquareText,

    git: "https://github.com/0xarchit/ChatDoc",
    docs: "https://docs.0xarchit.is-a.dev/ragchatdoc",
    demo: "https://chatdoc.0xarchit.is-a.dev",
  },
  {
    title: "Github Profile Analyzer",
    description:
      "AI Powered Github Profile analyzer and reviewer tool. Gives review based on first 100 repos and only includes those forks in which user has contributions to avoid fake results",
    icon: Gitlab,

    git: "https://github.com/0xarchit/github-profile-analyzer",
    docs: "https://docs.0xarchit.is-a.dev/githubprofileanalyser",
    demo: "https://git.0xcloud.workers.dev",
  },
  {
    title: "AI Classroom Assistant",
    description:
      "This project integrates emotion detection, voice-to-text, AI processing, and text-to-voice capabilities into a web-based teaching assistant system. Powered by FastAPI and  self trained LLaMA 3.1 3B.",
    icon: BotIcon,

    git: "https://github.com/0xarchit/Classroom_AI_Assistant",
    docs: "https://docs.0xarchit.is-a.dev/aiclassroomassistant",
    demo: "https://0xarchit-classroom-ai-assistant.hf.space",
  },
  {
    title: "DuckDuckGo Content Scraper",
    description:
      "Web scraping toolkit with Python and Cloudflare Worker—uses DuckDuckGo, Jina AI, Groq LLM, and GetPantry for dynamic search, storage, extraction, and analysis.",
    icon: FileSearch,

    git: "https://github.com/0xarchit/duckduckgo-webscraper",
    docs: "https://docs.0xarchit.is-a.dev/webscraper",
    demo: "https://duckduckgo-webscraper.onrender.com",
  },
  {
    title: "ArcArcGo",
    description:
      "ArcArcGo is a Cloudflare Worker that acts as a transparent proxy for DuckDuckGo, implementing custom branding and URL rewriting through regex patterns and JavaScript injection.",
    icon: Waypoints,

    git: "https://github.com/0xarchit/ArcArcGo",
    docs: "https://docs.0xarchit.is-a.dev/arcarcgo",
    demo: "https://arcarcgo.0xarc.workers.dev",
  },
  {
    title: "AI News Verification",
    description:
      "Advanced system for verifying news authenticity using AI and RAG. Features real-time fact-checking and source verification.",
    icon: Search,

    git: "https://github.com/0xarchit/news-verification-system",
    docs: "https://docs.0xarchit.is-a.dev/fakenews",
    demo: "https://news-verify.0xarchit.is-a.dev",
  },
  {
    title: "LearnTrack",
    description:
      "LearnTrack is a comprehensive learning management system designed for educational institutions with role-based access for students, faculty, and administrators.",
    icon: GraduationCap,

    git: "https://github.com/0xarchit/LearnTrack",
    docs: "https://docs.0xarchit.is-a.dev/learntrack",
    demo: "https://learntrack.pages.dev",
  },
  {
    title: "Scroll2PDF",
    description:
      "Transform lengthy web content into well-formatted PDF documents with a single click. Built with advanced PDF processing algorithms.",
    icon: ScrollText,

    git: "https://github.com/0xarchit/Scroll-To-Pdf",
    docs: "https://docs.0xarchit.is-a.dev/scroll2pdf",
    demo: "https://github.com/0xarchit/Scroll-To-Pdf/releases/tag/1.0.0",
  },
  {
    title: "CodeArc",
    description:
      "Next-generation AI chat Bot for coding assistance with advanced context understanding. Features real-time responses and memory management.",
    icon: Bot,

    git: "https://github.com/0xarchit/CodeArc",
    docs: "https://docs.0xarchit.is-a.dev/codearc",
    demo: "https://codearc.0xarchit.is-a.dev",
  },
  {
    title: "FTP Explorer",
    description:
      "A modern, secure, and responsive web-based FTP client built with PHP. Manage multiple FTP servers, upload/download files, and handle file operations with a clean user interface.",
    icon: FileSearchIcon,

    git: "https://github.com/0xarchit/FTP-Explorer",
    docs: "https://docs.0xarchit.is-a.dev/ftpexplorer",
    demo: "https://0xarchit.rf.gd",
  },
];

export const Projects = () => {
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
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {" "}
            {projects.slice(0, showAll ? projects.length : 4).map((project) => {
              const handleDemoClick = (
                e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
              ) => {
                if (project.demo === "#") {
                  e.preventDefault();
                  setShowComingSoonModal(true);
                }
              };
              const handleGitClick = (
                e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
              ) => {
                if (project.git === "#") {
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
