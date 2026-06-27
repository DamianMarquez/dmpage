

export interface Project {
  id: string;

  name: string;

  subtitle?: string;

  period: string;

  description: string;

  achievements?: string[];

  technologies: string[];

  github?: string;

  demo?: string;

  images?: string[];
}

export interface Company {
  id: string;

  company: string;

  role: string;

  from: string;

  to: string;

  logo: string;

  website?: string;

  primaryColor: string;

  secondaryColor: string;

  projects: Project[];
}