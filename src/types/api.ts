export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface ProjectLink {
  github: string;
  docs: string;
  demo: string;
}

export interface Project {
  id: string;
  title: string;
  role: string;
  tech: string[];
  desc: string;
  icon: string;
  links: ProjectLink;
}
