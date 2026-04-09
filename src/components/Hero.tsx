'use client';

import { motion } from 'framer-motion';
import { Blob } from './Blob';
import { Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AboutProfile } from '../types/api';
import {
  appendSessionErrorCode,
  appendSessionEvent,
  getClientContext,
  readSessionStats,
  writeSessionStats,
} from '../utils/tracking';

interface HeroProps {
  about: AboutProfile;
}

export const Hero = ({ about }: HeroProps) => {


  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <Blob />
      
      {/* Decorative Lights */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#64FFDA]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#233554]/40 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex min-h-[80vh] flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-[2px] w-12 bg-[#64FFDA]"></span>
            <span className="text-[#64FFDA] font-mono tracking-wide text-sm md:text-base cursor-default">
              Hi, my name is
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-[#CCD6F6] tracking-tight"
          >
            {about.firstname}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64FFDA] to-[#CCD6F6]/50">
              {about.lastname}.
            </span>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-[#8892B0] leading-tight"
          >
            {about.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[#8892B0] mb-12 max-w-2xl leading-relaxed"
          >
            {about.bio}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 md:gap-6"
          >
            <Link
              href="#projects"
              className="group relative px-8 py-4 bg-[#64FFDA] text-[#0A192F] font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(100,255,218,0.4)]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                Check out my work
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            
            {about.links.resume && (
              <motion.a
                href={about.links.resume}
                target="_blank"
                onClick={async (event) => {
                const downloadStartedAt = Date.now();
                const clickPoint = {
                  x: Math.round(event.clientX),
                  y: Math.round(event.clientY),
                };
                appendSessionEvent(
                  'downloadEvents',
                  {
                    resource: 'archit_resume.pdf',
                    status: 'start',
                    timestampMs: downloadStartedAt,
                    clickPoint,
                  },
                  50
                );
                try {
                  const sessionStats = readSessionStats();
                  const enrichedStats = {
                    ...sessionStats,
                    totalTime:
                      Date.now() -
                      (typeof sessionStats.startTime === 'number'
                        ? sessionStats.startTime
                        : Date.now()),
                  };
                  writeSessionStats(enrichedStats);
                  
                  await fetch('/api/track-download', { 
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          requestTimestampMs: Date.now(),
                          downloadStartedAt,
                          clickPoint,
                          clientContext: getClientContext(),
                          sessionStats: enrichedStats
                      })
                  });
                  appendSessionEvent(
                    'downloadEvents',
                    {
                      resource: 'archit_resume.pdf',
                      status: 'complete',
                      timestampMs: Date.now(),
                    },
                    50
                  );
                } catch (e) {
                  console.error('Tracking failed', e);
                  appendSessionErrorCode(
                    'DOWNLOAD_TRACKING_FAILED',
                    'resume_download'
                  );
                  appendSessionEvent(
                    'downloadEvents',
                    {
                      resource: 'archit_resume.pdf',
                      status: 'error',
                      timestampMs: Date.now(),
                      errorCode: 'DOWNLOAD_TRACKING_FAILED',
                    },
                    50
                  );
                }
                }}
                className="group relative px-8 py-4 backdrop-blur-sm bg-transparent border-2 border-[#64FFDA]/30 text-[#64FFDA] hover:border-[#64FFDA] hover:bg-[#64FFDA]/5 font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                  Resume
                </span>
              </motion.a>
            )}
            
            <Link
              href="/contact-us"
              className="text-[#8892B0] hover:text-[#CCD6F6] font-mono border-b border-transparent hover:border-[#64FFDA] pb-1 ml-2 transition-all"
            >
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
