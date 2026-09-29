import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { backgroundAnimation } from "./animations";

interface Props {
  primaryColor: string;
  secondaryColor: string;
  children: ReactNode;
}

export default function Background({
  primaryColor,
  secondaryColor,
  children,
}: Props) {
  return (
    <motion.div
      variants={backgroundAnimation}
      initial="initial"
      animate="animate"
      className="experience-background"
      style={{
        background: `
          linear-gradient(
            135deg,
            ${primaryColor}18 0%,
            #111118 48%,
            ${secondaryColor}12 100%
          )
        `,
          transition: "background 700ms ease",
      }}
    >
      {/* Glow superior */}
      <div
        className="experience-background-glow experience-background-glow-top"
        style={{
          background: primaryColor,
          transition: "background-color 700ms ease",
        }}
      />

      {/* Glow inferior */}
      <div
        className="experience-background-glow experience-background-glow-bottom"
        style={{
          background: secondaryColor,
          transition: "background-color 700ms ease",
        }}
      />

      {/* Patrón de fondo */}
      <div
        className="experience-background-pattern"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px,#ffffff 1px,transparent 0)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glass and centering wrapper to ensure content is centered within the card */}
      <div className="experience-background-content">
        <div className="experience-background-inner">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
