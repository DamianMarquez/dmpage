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
    <div className="w-full overflow-x-auto scrollbar-hide py-6">
      <div className="flex items-start min-w-max px-6">
        {projects.map((project, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={project.id}
              className="flex items-start"
            >
              <button
                ref={active ? activeRef : null}
                onClick={() => onSelect(index)}
                className="group flex flex-col items-center w-36"
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
                  className="relative h-5 w-5 rounded-full border-2"
                >
                  {active && (
                    <motion.div
                      layoutId="active-project"
                      className="absolute -inset-2 rounded-full"
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
                  className="mt-3 text-sm text-center leading-5"
                >
                  {project.name}
                </motion.span>

                {/* Período */}
                <span className="mt-1 text-xs text-gray-400">
                  {project.period}
                </span>
              </button>

              {/* Línea */}
              {index < projects.length - 1 && (
                <div className="relative mt-2 w-20 h-1 rounded-full bg-gray-200 overflow-hidden">
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
                    className="absolute left-0 top-0 h-full rounded-full"
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