import { motion } from 'framer-motion';
import { Github, ExternalLink, FileText } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { DynamicIcon } from './DynamicIcon';

interface ProjectCardProps {
  title: string;
  description: string;
  iconName: string;
  git: string;
  docs: string;
  demo: string;
  tech?: string[];
  onDemoClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onGitClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const ProjectCard = ({
  title,
  description,
  iconName,
  git,
  docs,
  demo,
  tech = [],
  onDemoClick,
  onGitClick
}: ProjectCardProps) => {
  return (
    <GlassCard className="h-full flex flex-col p-6 md:p-8 backdrop-blur-lg border-[#233554]/50 hover:border-[#64FFDA]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-15px_rgba(100,255,218,0.15)] group">
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 rounded-xl bg-[#233554]/50 text-[#64FFDA] border border-[#233554] group-hover:bg-[#64FFDA]/10 group-hover:border-[#64FFDA]/20 transition-colors">
          <DynamicIcon name={iconName} className="w-8 h-8" />
        </div>
        <div className="flex gap-3">
          {git && git !== '#' && (
            <a 
              href={git} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={onGitClick}
              className="text-[#8892B0] hover:text-[#64FFDA] transition-colors p-2 hover:bg-[#64FFDA]/10 rounded-full"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {docs && docs !== '#' && (
            <a 
              href={docs} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8892B0] hover:text-[#64FFDA] transition-colors p-2 hover:bg-[#64FFDA]/10 rounded-full"
              aria-label="Documentation"
            >
              <FileText className="w-5 h-5" />
            </a>
          )}
          {demo && demo !== '#' && (
            <a 
              href={demo} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={onDemoClick}
              className="text-[#8892B0] hover:text-[#64FFDA] transition-colors p-2 hover:bg-[#64FFDA]/10 rounded-full"
              aria-label="Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-[#CCD6F6] mb-3 group-hover:text-[#64FFDA] transition-colors">{title}</h3>
      <p className="text-[#8892B0] mb-6 leading-relaxed flex-grow">{description}</p>
      
      {tech && tech.length > 0 && (
         <div className="flex flex-wrap gap-2 mt-auto">
           {tech.map((item, idx) => (
             <span key={idx} className="text-xs font-mono text-[#64FFDA]">
               {item}
             </span>
           ))}
         </div>
      )}
    </GlassCard>
  );
};