"use client";
import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";

const AnimatedConstructionSVG = () => (
  <svg
    width="400"
    height="300"
    viewBox="0 0 400 300"
    className="w-full max-w-md mx-auto"
  >
    
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64FFDA" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#112240" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64FFDA" />
        <stop offset="100%" stopColor="#0A192F" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    
    <rect width="400" height="300" fill="url(#bgGradient)" rx="10" />

    
    <motion.g
      animate={{
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      
      <rect
        x="150"
        y="220"
        width="100"
        height="20"
        fill="#64FFDA"
        opacity="0.3"
        rx="2"
      />

      
      <motion.rect
        x="160"
        y="180"
        width="30"
        height="40"
        fill="url(#blockGradient)"
        animate={{
          y: [180, 175, 180],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.rect
        x="200"
        y="160"
        width="30"
        height="60"
        fill="url(#blockGradient)"
        animate={{
          y: [160, 155, 160],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.rect
        x="180"
        y="140"
        width="20"
        height="40"
        fill="#64FFDA"
        opacity="0.7"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.g>

    
    <motion.circle
      cx="80"
      cy="80"
      r="15"
      fill="#64FFDA"
      opacity="0.6"
      animate={{
        y: [80, 60, 80],
        x: [80, 90, 80],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    <motion.polygon
      points="320,60 340,40 360,60 340,80"
      fill="#CCD6F6"
      opacity="0.4"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />

    
    <rect x="50" y="250" width="300" height="8" fill="#112240" rx="4" />
    <motion.rect
      x="50"
      y="250"
      height="8"
      fill="#64FFDA"
      rx="4"
      initial={{ width: 0 }}
      animate={{ width: 240 }}
      transition={{
        duration: 2,
        delay: 1,
        ease: "easeOut",
      }}
    />

    
    <motion.circle
      cx="350"
      cy="50"
      r="4"
      fill="#64FFDA"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    <motion.circle
      cx="370"
      cy="70"
      r="3"
      fill="#CCD6F6"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
  </svg>
);

export default function Project() {
  return (
    <PageLayout
      title="Project Demo"
      description="A demo page for project approval and credential verification"
    >
      <div className="space-y-8 text-[#CCD6F6]">
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedConstructionSVG />
          </motion.div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4 text-center">
            Project Under Development
          </h2>
          <p className="leading-relaxed mb-4 text-center max-w-2xl mx-auto">
            This project is currently under active development. We're working
            hard to bring you an amazing experience with cutting-edge technology
            and innovative solutions.
          </p>
          <p className="leading-relaxed text-center max-w-2xl mx-auto">
            This page serves as a placeholder for project approval processes and
            can be used as a redirect URL for authentication credentials on
            platforms like Google Cloud.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Coming Soon
          </h2>
          <motion.div
            className="bg-[#112240] p-8 rounded-lg border border-[#64FFDA]/20 max-w-md mx-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p className="text-[#64FFDA] font-mono text-lg font-bold">
                Status: Under Construction
              </p>
            </motion.div>
            <div className="mt-4 flex justify-center space-x-2">
              <motion.div
                className="w-3 h-3 bg-[#64FFDA] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="w-3 h-3 bg-[#64FFDA] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
              <motion.div
                className="w-3 h-3 bg-[#64FFDA] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
          </motion.div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">Contact</h2>
          <p className="leading-relaxed">
            For inquiries about this project or collaboration opportunities,
            feel free to{" "}
            <a
              href="/contact-us"
              className="text-[#64FFDA] hover:underline transition-colors"
            >
              get in touch
            </a>
            .
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
