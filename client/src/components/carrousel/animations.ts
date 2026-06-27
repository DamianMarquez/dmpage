import  type{ Variants } from "framer-motion";

export const companyAnimation: Variants = {
  initial: {
    opacity: 0,
    x: 80,
    scale: 0.96,
  },

  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    x: -80,
    scale: 0.96,
    transition: {
      duration: 0.35,
      ease: "easeIn",
    },
  },
};

export const projectAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },

  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },

  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.25,
    },
  },
};

export const timelineAnimation: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },

  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
    },
  },
};

export const backgroundAnimation: Variants = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
};