import { motion } from "framer-motion";
import  type{ Project } from "./types";
import { useEffect, useRef } from "react";

interface Props {
  projects: Project[];
  currentIndex: number;
  primaryColor: string;
  onSelect: (index: number) => void;
}

export default function ProjectTimeline({
  projects,
  currentIndex,
  primaryColor,
  onSelect,
}: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const active = activeRef.current;
    if (!container || !active) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const targetLeft = container.scrollLeft
      + activeRect.left
      - containerRect.left
      - (container.clientWidth - activeRect.width) / 2;

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [currentIndex]);

  return (
    <div className="project-timeline">
      <div ref={scrollRef} className="project-timeline-scroll">
        {projects.map((project, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={project.id}
              className="project-timeline-item"
            >
              <button
                ref={active ? activeRef : null}
                onClick={() => onSelect(index)}
                className="project-timeline-button"
              >
                {/* Punto */}
                <motion.div
                  animate={{
                    scale: active ? 1.2 : 1,
                    backgroundColor: completed || active
                      ? primaryColor
                      : "#E5E7EB",
                    borderColor: primaryColor,
                  }}
                  transition={{
                    duration: .55,
                  }}
                  className="project-timeline-dot"
                >
                  {active && (
                    <motion.div
                      layoutId="active-project"
                      className="project-timeline-active-ring"
                      style={{
                        border: `2px solid ${primaryColor}`,
                      }}
                    />
                  )}
                </motion.div>

                {/* Nombre */}
                <motion.span
                  animate={{
                    color: active
                      ? primaryColor
                      : "#6B7280",
                    fontWeight: active ? 700 : 500,
                  }}
                  className="project-timeline-name"
                >
                  {project.name}
                </motion.span>

                {/* Período */}
                <span className="project-timeline-period">
                  {project.period}
                </span>
              </button>

              {/* Línea */}
              {index < projects.length - 1 && (
                <div className="project-timeline-connector">
                  <motion.div
                    initial={false}
                    animate={{
                      width:
                        completed
                          ? "100%"
                          : active
                          ? "50%"
                          : "0%",
                      backgroundColor: primaryColor,
                    }}
                    transition={{
                      duration: .6,
                    }}
                    className="project-timeline-connector-progress"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
