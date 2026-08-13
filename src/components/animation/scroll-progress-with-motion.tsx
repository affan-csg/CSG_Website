import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * ScrollProgressWithMotion — The actual motion-powered scroll progress bar.
 * Only loaded when user starts scrolling.
 *
 * Respects prefers-reduced-motion by using instant animation.
 */
export default function ScrollProgressWithMotion() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Use instant animation for reduced motion preference
  const width = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 1000 : 140, // Instant if reduced motion
    damping: prefersReducedMotion ? 1000 : 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-gold"
    />
  );
}
