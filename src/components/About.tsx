"use client";
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { AboutProfile } from '../types/api';
import { Sparkles, Target, Zap, Heart } from 'lucide-react';

interface AboutProps {
  about: AboutProfile;
}

const cleanBackground = (value: string) =>
  (value || "").replace(/`/g, "").replace(/\r\n/g, "\n").trim();

const renderFormattedBackground = (background: string) => {
  const blocks = cleanBackground(background)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const isHighlightBlock = lines[0]?.toLowerCase().includes("currently focused on");
    
    const bulletLines = lines
      .filter((line) => line.startsWith("•"))
      .map((line) => line.replace(/^•\s*/, ""));
    const textLines = lines.filter((line) => !line.startsWith("•") && !line.toLowerCase().includes("currently focused on"));

    return (
      <div key={`bg-${index}`} className="mb-6 last:mb-0">
        {textLines.length > 0 && (
          <p className="leading-relaxed text-[#CCD6F6]/80 mb-3">{textLines.join(" ")}</p>
        )}
        
        {isHighlightBlock && (
          <div className="flex items-center gap-2 mb-3 text-[#64FFDA]">
            <Target className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider text-xs">Currently Focused On</span>
          </div>
        )}

        {bulletLines.length > 0 && (
          <div className={`grid grid-cols-1 gap-3 ${isHighlightBlock ? 'bg-[#64FFDA]/5 p-4 rounded-xl border border-[#64FFDA]/10' : ''}`}>
            {bulletLines.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#64FFDA] shadow-[0_0_8px_rgba(100,255,218,0.6)] group-hover:scale-125 transition-transform" />
                <span className="text-[#CCD6F6]/90 transition-colors group-hover:text-[#64FFDA]">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });
};

export const About = ({ about }: AboutProps) => {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#64FFDA]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#233554]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 text-[#64FFDA] text-xs font-medium mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>Meet the Developer</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 text-[#CCD6F6]"
          >
            About <span className="text-[#64FFDA]">Me</span>
          </motion.h2>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg md:text-xl text-[#8892B0] max-w-2xl mx-auto leading-relaxed"
          >
            {about.bio}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Background Card */}
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="lg:col-span-7"
          >
            <GlassCard className="h-full border-[#233554]/50 hover:border-[#64FFDA]/30 transition-colors p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-lg bg-[#64FFDA]/10 text-[#64FFDA]">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#CCD6F6]">My Journey</h3>
              </div>
              <div className="space-y-2">
                {renderFormattedBackground(about.background)}
              </div>
            </GlassCard>
          </motion.div>

          {/* Interests Card */}
          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="lg:col-span-5"
          >
            <GlassCard className="h-full border-[#233554]/50 hover:border-[#64FFDA]/30 transition-colors p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-lg bg-[#64FFDA]/10 text-[#64FFDA]">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#CCD6F6]">Interests</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {about.interests.map((interest, i) => (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    key={interest}
                    className="px-4 py-2 text-sm rounded-xl bg-[#233554]/40 border border-[#233554] text-[#8892B0] hover:text-[#64FFDA] hover:border-[#64FFDA]/30 hover:bg-[#64FFDA]/5 transition-all cursor-default"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
