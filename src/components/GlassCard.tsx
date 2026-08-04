"use client";
import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hoverEffect ? { scale: 1.02 } : undefined}
      className={`backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};