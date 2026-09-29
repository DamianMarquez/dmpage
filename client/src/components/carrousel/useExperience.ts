import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useSwipeable } from "react-swipeable";
import type { Company } from "./types";

interface UseExperienceProps {
  companies: Company[];
  scrollTargetRef: RefObject<HTMLElement | null>;
}

export default function useExperience({
  companies,
  scrollTargetRef,
}: UseExperienceProps) {
  const [companyIndex, setCompanyIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const scrollAnimationRef = useRef<number | null>(null);

  const company = companies[companyIndex];
  const project = company?.projects?.[projectIndex];

  // Total de proyectos
  const totalProjects = useMemo(() => {
    return companies.reduce(
      (acc, c) => acc + (c.projects?.length || 0),
      0
    );
  }, [companies]);

  // Proyecto global
  const globalProjectIndex = useMemo(() => {
    let total = 0;
    for (let i = 0; i < companyIndex; i++) {
      total += companies[i].projects.length;
    }
    total += (projectIndex ?? 0) + 1;
    return total;
  }, [companies, companyIndex, projectIndex]);

  const scrollToExperience = useCallback(() => {
    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    requestAnimationFrame(() => {
      const target = scrollTargetRef.current;
      if (!target) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const targetStyle = window.getComputedStyle(target);
      const offset = parseFloat(targetStyle.scrollMarginTop) || 0;
      const start = window.scrollY;
      const destination = Math.max(
        0,
        target.getBoundingClientRect().top + start - offset
      );

      if (reduceMotion || Math.abs(destination - start) < 1) {
        window.scrollTo(0, destination);
        return;
      }

      const duration = 950;
      const startedAt = performance.now();
      const easeInOut = (value: number) =>
        value < 0.5
          ? 2 * value * value
          : 1 - Math.pow(-2 * value + 2, 2) / 2;

      const animate = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        window.scrollTo(
          0,
          start + (destination - start) * easeInOut(progress)
        );

        if (progress < 1) {
          scrollAnimationRef.current = requestAnimationFrame(animate);
        } else {
          scrollAnimationRef.current = null;
        }
      };

      scrollAnimationRef.current = requestAnimationFrame(animate);
    });
  }, [scrollTargetRef]);

  // Avanzar
  const next = useCallback(() => {
    if (!company) return;
    if (projectIndex < company.projects.length - 1) {
      setProjectIndex((p) => p + 1);
      return;
    }
    if (companyIndex < companies.length - 1) {
      setCompanyIndex((c) => c + 1);
      setProjectIndex(0);
      scrollToExperience();
    }
  }, [company, companies, companyIndex, projectIndex, scrollToExperience]);

  // Retroceder
  const previous = useCallback(() => {
    if (projectIndex > 0) {
      setProjectIndex((p) => p - 1);
      return;
    }
    if (companyIndex > 0) {
      const previousCompany = companies[companyIndex - 1];
      setCompanyIndex((c) => c - 1);
      setProjectIndex(previousCompany.projects.length - 1);
      scrollToExperience();
    }
  }, [companyIndex, projectIndex, companies, scrollToExperience]);

  // Ir a una empresa
  const goToCompany = useCallback((index: number) => {
    if (index < 0) return;
    if (index >= companies.length) return;
    if (index === companyIndex) return;

    setCompanyIndex(index);
    setProjectIndex(0);
    scrollToExperience();
  }, [companies, companyIndex, scrollToExperience]);

  // Ir a un proyecto
  const goToProject = useCallback((index: number) => {
    if (index < 0) return;
    if (!company?.projects) return;
    if (index >= company.projects.length) return;
    setProjectIndex(index);
  }, [company]);

  // Swipe Mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft() {
      next();
    },
    onSwipedRight() {
      previous();
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  // Flechas teclado
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          previous();
          break;
        case "ArrowRight":
          next();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, previous]);

  const first = () => {
    if (companyIndex !== 0) scrollToExperience();
    setCompanyIndex(0);
    setProjectIndex(0);
  };

  const last = () => {
    const lastCompany = companies[companies.length - 1];
    if (companyIndex !== companies.length - 1) scrollToExperience();
    setCompanyIndex(companies.length - 1);
    setProjectIndex(lastCompany.projects.length - 1);
  };

  return {
    company,
    project,
    companyIndex,
    projectIndex,
    totalProjects,
    globalProjectIndex,
    next,
    previous,
    goToCompany,
    goToProject,
    swipeHandlers,
    first,
    last,
  };
}
