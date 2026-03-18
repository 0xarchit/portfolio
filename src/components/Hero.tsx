'use client';

import { motion } from 'framer-motion';
import { Blob } from './Blob';
import { Download } from 'lucide-react';
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
    <section className="min-h-screen flex items-center relative overflow-hidden pt-40 md:pt-20">
      <Blob />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#64FFDA] font-mono mb-4 block"
          >
            Hi, my name is
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-bold mb-4 text-[#CCD6F6]"
          >
            {about.firstname}.
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-6xl font-bold mb-6 text-[#8892B0]"
          >
            {about.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[#c9cfdf] mb-8 max-w-2xl"
          >
            {about.bio}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="#projects"
              className="w-full sm:w-auto px-6 py-3 border-2 border-[#64FFDA] text-[#64FFDA] hover:bg-[#64FFDA]/10 rounded-lg font-semibold transition-colors text-center"
            >
              View Projects
            </Link>
            <Link
              href="/contact-us"
              className="w-full sm:w-auto px-6 py-3 bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 rounded-lg font-semibold transition-colors text-center"
            >
              Contact Me
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 rounded-lg font-semibold transition-colors group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                Download Resume
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
