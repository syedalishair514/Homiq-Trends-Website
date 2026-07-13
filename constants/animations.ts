import { Variants } from "framer-motion";

export const fadeIn = (duration = 0.4): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration, ease: "easeOut" } },
});

export const slideUp = (duration = 0.5, yOffset = 20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
});

export const slideDown = (duration = 0.4, yOffset = -20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
});

export const slideLeft = (duration = 0.4, xOffset = 50): Variants => ({
  hidden: { opacity: 0, x: xOffset },
  visible: { opacity: 1, x: 0, transition: { duration, ease: "easeOut" } },
});

export const scale = (duration = 0.3): Variants => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration, ease: "easeOut" } },
});

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const hoverCard: Variants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export const hoverButton: Variants = {
  hover: {
    scale: 1.03,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  tap: {
    scale: 0.97,
  },
};
