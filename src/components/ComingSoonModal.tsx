import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { X } from 'lucide-react';

interface ComingSoonModalProps {
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-60"
      >
        <GlassCard className="p-6 relative">
          <button 
            className="absolute top-2 right-2 text-[#64FFDA]" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-[#CCD6F6] mb-4">Coming Soon</h2>
          <p className="text-[#8892B0]">
            This is currently unavailable. Please check back later!
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};
