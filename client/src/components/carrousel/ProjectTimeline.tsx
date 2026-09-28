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

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentIndex]);

  return (
    <div className="project-timeline">
      <div className="project-timeline-scroll">
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
                    duration: .30,
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
                      duration: .35,
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
