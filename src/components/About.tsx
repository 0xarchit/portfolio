"use client";
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { AboutProfile } from '../types/api';

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

    const bulletLines = lines
      .filter((line) => line.startsWith("•"))
      .map((line) => line.replace(/^•\s*/, ""));
    const textLines = lines.filter((line) => !line.startsWith("•"));

    if (bulletLines.length > 0) {
      return (
        <div key={`bg-${index}`} className="space-y-2">
          {textLines.length > 0 && (
            <p className="leading-relaxed text-gray-300">{textLines.join(" ")}</p>
          )}
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {bulletLines.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p key={`bg-${index}`} className="leading-relaxed text-gray-300">
        {textLines.join(" ")}
      </p>
    );
  });
};

export const About = ({ about }: AboutProps) => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
        >
          About Me
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-16">
          <GlassCard>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Background</h3>
            <div className="space-y-4">{renderFormattedBackground(about.background)}</div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Interests</h3>
            <ul className="text-gray-300 space-y-2">
              {about.interests.map((interest) => (
                <li key={interest}>• {interest}</li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
