import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <GlassCard className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Get In Touch</h2>
          <p className="text-gray-300 mb-6 md:mb-8">
            I'm always open to new opportunities and interesting projects.
            Let's connect and create something amazing together!
          </p>
          <div className="flex justify-center gap-4 md:gap-6">
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              href="https://github.com/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5 md:w-6 md:h-6">
                <title>GitHub Icon</title>
              </Github>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              href="https://www.linkedin.com/in/0xarchit/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5 md:w-6 md:h-6">
                <title>LinkedIn Icon</title>
              </Linkedin>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              href="https://x.com/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-5 h-5 md:w-6 md:h-6">
                <title>Twitter Icon</title>
              </Twitter>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              href="mailto:mail@0xarchit.is-a.dev"
              className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Email Contact"
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6">
                <title>Email Icon</title>
              </Mail>
            </motion.a>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};