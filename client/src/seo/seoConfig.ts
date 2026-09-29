export const siteUrl = "https://marquezdamian.com.ar";
export const socialImage = `${siteUrl}/og-image.svg`;

export type SeoPageKey =
  | "home"
  | "about"
  | "experience"
  | "skills"
  | "contact";

export interface SeoPage {
  path: string;
  title: string;
  description: string;
  heading: string;
  breadcrumb?: string;
  profilePage?: boolean;
}

export const seoPages: Record<SeoPageKey, SeoPage> = {
  home: {
    path: "/",
    title: "Damian Marquez | Desarrollador Full Stack Senior",
    description:
      "Damian Marquez es desarrollador Full Stack Senior, arquitecto de soluciones y mentor técnico especializado en Go, Java, React, sistemas distribuidos y automatización con AI.",
    heading: "Damian Marquez",
  },
  about: {
    path: "/sections/about",
    title: "Sobre Damian Marquez | Arquitectura, liderazgo y mentoring",
    description:
      "Conocé la trayectoria de Damian Marquez en ingeniería de software, arquitectura de soluciones, liderazgo técnico, mentoring y automatización.",
    heading: "Sobre Damian Marquez",
    breadcrumb: "Sobre mí",
    profilePage: true,
  },
  experience: {
    path: "/sections/experience",
    title: "Experiencia profesional | Damian Marquez",
    description:
      "Experiencia profesional de Damian Marquez en Go, Java, React, sistemas distribuidos, Business Intelligence, cloud, automatización y liderazgo técnico.",
    heading: "Experiencia profesional",
    breadcrumb: "Experiencia",
  },
  skills: {
    path: "/sections/skills",
    title: "Skills y tecnologías | Go, Java, React y AI",
    description:
      "Stack técnico de Damian Marquez: Go, Java, Spring Boot, React, TypeScript, Node.js, bases de datos, cloud, mensajería, AI y automatización.",
    heading: "Skills y tecnologías",
    breadcrumb: "Skills",
  },
  contact: {
    path: "/sections/contact",
    title: "Contacto | Damian Marquez",
    description:
      "Contactá a Damian Marquez para oportunidades remotas, consultoría, arquitectura de software, mentoring técnico y colaboraciones interesantes.",
    heading: "Contacto",
    breadcrumb: "Contacto",
  },
};
