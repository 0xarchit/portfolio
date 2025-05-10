import { motion } from 'framer-motion';
import { Github, ExternalLink, FileText, DivideIcon as LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ProjectCardProps {
  title: string;
  description: string;
  icon: typeof LucideIcon;
  color: string;
  git: string;
  docs: string;
  demo: string;
  onDemoClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onGitClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const colorMap = {
  blue: 'bg-[#64FFDA]/10 text-[#64FFDA]',
  teal: 'bg-[#64FFDA]/10 text-[#64FFDA]',
  purple: 'bg-[#64FFDA]/10 text-[#64FFDA]',
  pink: 'bg-[#64FFDA]/10 text-[#64FFDA]'
};

export const ProjectCard = ({
  title,
  description,
  icon: Icon,
  color,
  git,
  docs,
  demo,
  onDemoClick,
  onGitClick
}: ProjectCardProps) => {
  return (
    <GlassCard className="backdrop-blur-lg bg-[#233554]/10">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color as keyof typeof colorMap]}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-[#CCD6F6]">{title}</h3>
      </div>
      <p className="text-[#8892B0] mb-6">{description}</p>
      <div className="flex gap-4 flex-wrap">
        <motion.a
          whileHover={{ scale: 1.05 }}
          href={git}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onGitClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 transition-colors"
        >
          <Github className="w-5 h-5" />
          GitHub
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href={docs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 transition-colors"
        >
          <FileText className="w-5 h-5" />
          Docs
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onDemoClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          Live Demo
        </motion.a>
      </div>
    </GlassCard>
  );
};