import { motion } from 'framer-motion';
import { Blob } from './Blob';
import { Download } from 'lucide-react';

export const Hero = () => {
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
            Archit.
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-6xl font-bold mb-6 text-[#8892B0]"
          >
            I build things for the web.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[#c9cfdf] mb-8 max-w-2xl"
          >
            I'm a full-stack developer specializing in building exceptional digital experiences.
            Currently, I'm focused on building accessible, human-centered products using cutting-edge technologies.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3 border-2 border-[#64FFDA] text-[#64FFDA] hover:bg-[#64FFDA]/10 rounded-lg font-semibold transition-colors text-center"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3 bg-[#64FFDA]/10 text-[#64FFDA] hover:bg-[#64FFDA]/20 rounded-lg font-semibold transition-colors text-center"
            >
              Contact Me
            </a>
            <motion.a
              href="https://drive.google.com/uc?export=download&id=1ljbJVGddcH8Zld8YO4vvepGt7FdIqgEb"
              download
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 rounded-lg font-semibold transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
              Download Resume
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};