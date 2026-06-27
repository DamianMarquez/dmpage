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
      key={primaryColor}
      variants={backgroundAnimation}
      initial="initial"
      animate="animate"
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `
          linear-gradient(
            135deg,
            ${secondaryColor} 0%,
            #ffffff 45%,
            ${primaryColor}22 100%
          )
        `,
        transition: "background 700ms ease",
      }}
    >
      {/* Glow superior */}
      <div
        className="absolute -top-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-25"
        style={{
          background: primaryColor,
        }}
      />

      {/* Glow inferior */}
      <div
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{
          background: secondaryColor,
        }}
      />

      {/* Patrón de fondo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px,#000 1px,transparent 0)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glass */}
      <div className="relative backdrop-blur-[6px] min-h-full">
        {children}
      </div>
    </motion.div>
  );
}