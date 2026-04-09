"use client";

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { SkillCategory } from '../types/api';
import { DynamicIcon } from './DynamicIcon';

interface SkillsProps {
  skills: SkillCategory[];
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

export const Skills = ({ skills }: SkillsProps) => {
  return (
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#64FFDA]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 text-[#64FFDA] text-xs font-medium mb-6">
             <DynamicIcon name="Layers" className="w-3 h-3" />
             <span>My Arsenal</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6]">
            Technical <span className="text-[#64FFDA]">Skills</span>
          </h2>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {skills.map(({ name, icon, skills: skillList }) => (
            <motion.div 
              key={name} 
              variants={itemVariants} 
              className="break-inside-avoid"
            >
              <GlassCard className="flex flex-col p-6 md:p-8 backdrop-blur-lg border-[#233554]/50 hover:border-[#64FFDA]/30 transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(100,255,218,0.15)] group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[#233554]/50 text-[#64FFDA] border border-[#233554] group-hover:bg-[#64FFDA]/10 group-hover:border-[#64FFDA]/20 transition-colors">
                    <DynamicIcon name={icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#CCD6F6]">{name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#233554]/30 border border-[#233554] text-[#8892B0] hover:text-[#64FFDA] hover:border-[#64FFDA]/30 hover:bg-[#64FFDA]/5 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};