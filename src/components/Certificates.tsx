"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CertificatesData } from "@/types/api";
import { ExternalLink, X, Award, Eye, Sparkles, ShieldCheck } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { DynamicIcon } from "./DynamicIcon";

interface CertificatesProps {
  certificates?: CertificatesData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function Certificates({ certificates }: CertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedCert]);

  if (!certificates || !certificates.certs) {
    return null;
  }

  const { shown = [], certs = {} } = certificates;
  const allTitles = Object.keys(certs);
  if (allTitles.length === 0) return null;

  const shownTitlesSet = new Set(shown);
  const remainingTitles = allTitles.filter((title) => !shownTitlesSet.has(title));

  return (
    <section id="certificates" className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative backdrop glow matching Skills & Projects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#64FFDA]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 text-[#64FFDA] text-xs font-medium mb-6">
            <DynamicIcon name="Award" className="w-3.5 h-3.5" />
            <span>Credentials & Accomplishments</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6] mb-6">
            Certifications & <span className="text-[#64FFDA]">Courses</span>
          </h2>
          
          {/* Credly Verification Link Button */}
          <div className="flex justify-center">
            <a
              href="https://www.credly.com/users/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#233554]/40 hover:bg-[#64FFDA]/10 border border-[#233554] hover:border-[#64FFDA]/40 text-[#64FFDA] text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-lg group"
            >
              <ShieldCheck className="w-4 h-4 text-[#64FFDA] group-hover:scale-110 transition-transform" />
              <span>Verify Badges on Credly</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
        </motion.div>

        {/* Featured / Shown Certificates - Forever-Symmetric Auto-Centering Flex Grid */}
        {shown.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-bold text-[#CCD6F6] mb-8 flex items-center justify-center md:justify-start gap-2">
              <Award className="w-5 h-5 text-[#64FFDA]" />
              <span>Featured Certificates</span>
            </h3>

            {/* Flex-wrap with justify-center ensures leftover items (e.g. 5th, 7th item) automatically sit centered in the bottom row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-wrap justify-center gap-6"
            >
              {shown.map((title) => {
                const imgUrl = certs[title];
                if (!imgUrl) return null;
                return (
                  <motion.div
                    key={title}
                    variants={itemVariants}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm flex-grow-0 flex-shrink-0"
                  >
                    <GlassCard
                      onClick={() => setSelectedCert({ title, url: imgUrl })}
                      className="h-full flex flex-col p-4 backdrop-blur-lg border-[#233554]/50 hover:border-[#64FFDA]/30 transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(100,255,218,0.15)] group cursor-pointer overflow-hidden"
                    >
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-[#020C1B] border border-[#233554]/40 flex items-center justify-center">
                        {/* eslint-disable-next-html-element-suppression */}
                        <img
                          src={imgUrl}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#0A192F]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F]/90 border border-[#64FFDA]/50 text-[#64FFDA] text-xs font-medium shadow-lg">
                            <Eye className="w-3.5 h-3.5" /> Enlarge
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-[#CCD6F6] group-hover:text-[#64FFDA] transition-colors leading-snug">
                        {title}
                      </h4>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* More Certificates - Glassmorphism Badges */}
        {remainingTitles.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-[#CCD6F6] mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#64FFDA]" />
              <span>More Specializations & Certifications</span>
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-wrap justify-center md:justify-start gap-3"
            >
              {remainingTitles.map((title) => {
                const imgUrl = certs[title];
                return (
                  <motion.button
                    key={title}
                    variants={itemVariants}
                    onClick={() => setSelectedCert({ title, url: imgUrl })}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="relative group px-4 py-2 rounded-xl bg-[#233554]/30 backdrop-blur-lg border border-[#233554] hover:border-[#64FFDA]/40 transition-all duration-300 text-white font-medium text-xs md:text-sm hover:bg-[#64FFDA]/10 hover:shadow-[0_4px_20px_-5px_rgba(100,255,218,0.2)] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#64FFDA] group-hover:scale-125 transition-all" />
                    <span>{title}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* Full Quality Modal Popup */}
      {selectedCert && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-2 md:p-6 bg-[#0A192F]/90 backdrop-blur-xl animate-fadeIn">
          {/* Clickable backdrop overlay */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedCert(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 bg-[#0A192F] border border-[#233554] rounded-2xl w-full max-w-6xl flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-[#233554] flex items-center justify-between bg-[#0A192F] shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-[#CCD6F6] pr-4 truncate">
                {selectedCert.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedCert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#8892B0] hover:text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors"
                  title="Open original high-res image in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 text-[#8892B0] hover:text-white rounded-lg hover:bg-[#64FFDA]/10 transition-colors"
                  title="Close popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Dynamic fluid size image container */}
            <div className="p-2 md:p-4 bg-[#020C1B] flex items-center justify-center overflow-auto">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={selectedCert.url}
                alt={selectedCert.title}
                className="max-w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl border border-[#233554]/40 text-center"
                loading="eager"
                decoding="sync"
                style={{ imageRendering: "auto" }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
