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

export interface AboutLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  docs?: string;
  leetcode?: string;
  codolio?: string;
  peerlist?: string;
  portfolio_secondary?: string;
  card?: string;
  resume?: string;
}

export interface AboutProfile {
  firstname: string;
  lastname: string;
  username: string;
  title: string;
  bio: string;
  background: string;
  links: AboutLinks;
  interests: string[];
}

export interface CertificatesData {
  shown: string[];
  certs: Record<string, string>;
}

export interface AllPortfolioData {
  about: AboutProfile;
  projects: Project[];
  skills: SkillCategory[];
  certificates?: CertificatesData;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  tags: string[];
  readingTime?: string;
}

export interface BlogPostFull extends BlogPost {
  body: string;
}

