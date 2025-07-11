import { motion } from 'framer-motion';
import { Code, Database, Brain, Globe, Server, Shield, Terminal, Cpu, TabletSmartphone } from 'lucide-react';
import { GlassCard } from './GlassCard';

const skills = [
  {
    name: 'Frontend Development',
    icon: Globe,
    skills: ['HTML', 'CSS', 'Javascript', 'TypeScript', 'React', 'BootStrap', 'Tailwind CSS', 'Redux']
  },
  {
    name: 'Backend Development',
    icon: Server,
    skills: ['Node.js', 'Express', 'FastAPI', 'Flask', 'Socket.io']
  },
  {
    name: 'Mobile Development',
    icon: TabletSmartphone,
    skills: ['React Native', 'CapacitorJs']
  },
  {
    name: 'UI/UX Design',
    icon: Cpu,
    skills: ['Figma', 'Canva', 'Framer']
  },
  {
    name: 'Database',
    icon: Database,
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'MySQL', 'SQLite']
  },
  {
    name: 'DevOps & Cloud',
    icon: Terminal,
    skills: ['Docker', 'AWS', 'GCP', 'CI/CD', 'Linux', 'Nginx', 'Apache', 'Cloudflare', 'Heroku', 'Railway', 'Koyeb', 'Vercel', 'Netlify', 'Render']
  },
  {
    name: 'AI & Machine Learning',
    icon: Brain,
    skills: ['Pandas', 'NumPy', 'Matplotlib']
  },
  {
    name: 'Programming & Scripting Languages',
    icon: Code,
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Bash']
  },
  {
    name: 'Security',
    icon: Shield,
    skills: ['Web Security', 'OAuth', 'JWT']
  },
  {
    name: 'Tools & Others',
    icon: Cpu,
    skills: ['SEO', 'Git', 'VS Code', 'Postman', 'N8N','BurpSuite', 'Discord', 'Notion', 'Android Studio', 'Jupyter Notebook', 'Google Colab', 'Open Source']
  }
];

export const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-[#64FFDA]"
        >
          Technical Skills
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map(({ name, icon: Icon, skills }) => (
            <GlassCard key={name} className="w-full sm:w-1/2 md:w-1/4 backdrop-blur-lg bg-[#233554]/10">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-[#64FFDA]" />
                <h3 className="text-lg md:text-xl font-semibold text-[#CCD6F6]">{name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-[#64FFDA]/10 text-[#64FFDA]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};