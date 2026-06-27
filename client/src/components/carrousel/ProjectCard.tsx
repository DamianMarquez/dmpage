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
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        variants={projectAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Card
          elevation={0}
          className="
            rounded-3xl
            border
            border-white/40
            bg-white/70
            backdrop-blur-xl
            shadow-xl
          "
        >
          <div className="p-8">

            {/* Header */}

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-3xl font-bold">
                  {project.name}
                </h2>

                {project.subtitle && (
                  <p className="text-lg text-gray-500 mt-1">
                    {project.subtitle}
                  </p>
                )}

                <p className="text-sm text-gray-400 mt-3">
                  {project.period}
                </p>

              </div>

              <div className="flex gap-2">

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

            <p className="text-gray-700 leading-8 whitespace-pre-line">
              {project.description}
            </p>

            {/* Logros */}

            {project.achievements &&
              project.achievements.length > 0 && (

                <>
                  <div className="flex items-center gap-2 mt-8 mb-4">

                    <EmojiEventsIcon
                      sx={{
                        color: primaryColor,
                      }}
                    />

                    <h3 className="font-semibold text-lg">
                      Logros
                    </h3>

                  </div>

                  <ul className="space-y-3">

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
                        className="flex gap-3"
                      >
                        <span
                          className="mt-2 h-2 w-2 rounded-full"
                          style={{
                            background: primaryColor,
                          }}
                        />

                        <span className="text-gray-700">
                          {item}
                        </span>

                      </motion.li>

                    ))}

                  </ul>

                </>
            )}

            {/* Tecnologías */}

            <div className="mt-10">

              <h3 className="font-semibold text-lg mb-4">
                Tecnologías
              </h3>

              <div className="flex flex-wrap gap-3">

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

                <div className="grid md:grid-cols-2 gap-4 mt-10">

                  {project.images.map((image) => (

                    <motion.img
                      whileHover={{
                        scale: 1.02,
                      }}
                      key={image}
                      src={image}
                      alt=""
                      className="
                        rounded-xl
                        shadow-lg
                        object-cover
                        w-full
                      "
                    />

                  ))}

                </div>

            )}

          </div>

        </Card>

      </motion.div>
    </AnimatePresence>
  );
}