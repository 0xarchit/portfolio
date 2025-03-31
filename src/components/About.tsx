import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

export const About = () => {
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
            <p className="text-gray-300">
              Hi, I'm Archit Jain, aka '0xArchit', a programmer and student in India. I love exploring and learning new Tech.
              Currently I am learning MERN Stack, Python and Ai Implementation, Cyber Security, Ethical Hacking, and many more.
              By keeping myself diverse in the tech field and following my passion, I have become a self-taught programmer.
              I learned most of things by Reverse Engineering and watching various YouTube videos and courses.
              I enjoy reading business, stock, and crypto market news in my free time.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Interests</h3>
            <p className="text-gray-300">
              My hobbies include: <br />
              • Gaming - Passionate about playing strategy and FPS games. <br />
              • Reading - Try new tech, reading Tech news and blogs, Market and Business news. <br />
              • Explore and Learn - Open-Source Development, A.I., Crypto, Blockchain, Cyber Security & Ethical Hacking.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};