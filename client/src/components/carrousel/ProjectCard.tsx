import {
  Card,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { AnimatePresence, motion } from "framer-motion";
import { projectAnimation } from "./animations";
import  type{ Project } from "./types";

interface Props {
  project: Project;
  primaryColor: string;
}

export default function ProjectCard({
  project,
  primaryColor,
}: Props) {
  return (
    <div className="project-card-wrapper">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={project.id}
          className="project-card-animation"
          variants={projectAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
        <Card
          elevation={0}
          className="project-card"
          sx={{
            backgroundColor: "rgba(17, 17, 24, 0.78)",
            color: "var(--text)",
          }}
        >
          <div className="project-card-content">

            {/* Header */}

            <div className="project-card-header">

              <div className="project-card-heading">

                <h2 className="project-card-title">
                  {project.name}
                </h2>

                {project.subtitle && (
                  <p className="project-card-subtitle">
                    {project.subtitle}
                  </p>
                )}

                <p className="project-card-period">
                  {project.period}
                </p>

              </div>

              <div className="project-card-links">

                {project.github && (
                  <Tooltip title="GitHub">

                    <IconButton
                      component="a"
                      href={project.github}
                      target="_blank"
                    >
                      <GitHubIcon />
                    </IconButton>

                  </Tooltip>
                )}

                {project.demo && (
                  <Tooltip title="Demo">

                    <IconButton
                      component="a"
                      href={project.demo}
                      target="_blank"
                    >
                      <LaunchIcon />
                    </IconButton>

                  </Tooltip>
                )}

              </div>

            </div>

            <Divider className="my-6" />

            {/* Descripción */}

            <p className="project-card-description">
              {project.description}
            </p>

            {/* Logros */}

            {project.achievements &&
              project.achievements.length > 0 && (

                <>
                  <div className="project-card-achievements-heading">

                    <EmojiEventsIcon
                      sx={{
                        color: primaryColor,
                      }}
                    />

                    <h3 className="project-card-section-title">
                      Logros
                    </h3>

                  </div>

                  <ul className="project-card-achievements">

                    {project.achievements.map((item) => (

                      <motion.li
                        key={item}
                        initial={{
                          opacity: 0,
                          x: -20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        className="project-card-achievement"
                      >
                        <span
                          className="project-card-achievement-dot"
                          style={{
                            background: primaryColor,
                          }}
                        />

                        <span>
                          {item}
                        </span>

                      </motion.li>

                    ))}

                  </ul>

                </>
            )}

            {/* Tecnologías */}

            <div className="project-card-technologies">

              <h3 className="project-card-section-title">
                Tecnologías
              </h3>

              <div className="project-card-tech-list">

                {project.technologies.map((tech) => (

                  <motion.div
                    key={tech}
                    whileHover={{
                      scale: 1.08,
                    }}
                  >

                    <Chip
                      label={tech}
                      sx={{
                        borderColor: primaryColor,
                        color: primaryColor,
                      }}
                      variant="outlined"
                    />

                  </motion.div>

                ))}

              </div>

            </div>

            {/* Imágenes */}

            {project.images &&
              project.images.length > 0 && (

                <div className="project-card-images">

                  {project.images.map((image) => (

                    <motion.img
                      whileHover={{
                        scale: 1.02,
                      }}
                      key={image}
                      src={image}
                      alt={`${project.name} — proyecto de Damian Marquez`}
                      loading="lazy"
                      decoding="async"
                      className="project-card-image"
                    />

                  ))}

                </div>

            )}

          </div>

        </Card>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
