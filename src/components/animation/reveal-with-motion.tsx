import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
};

/**
 * RevealWithMotion — The actual motion-powered reveal component.
 * Only loaded when needed via LazyReveal parent.
 *
 * Respects prefers-reduced-motion by rendering static content
 * when user has enabled the accessibility setting.
 */
export default function RevealWithMotion({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Comp = motion[as as keyof typeof motion];

  // Show static content for accessibility
  if (prefersReducedMotion) {
    const StaticElement = as as keyof JSX.IntrinsicElements;
    return <StaticElement className={className}>{children}</StaticElement>;
  }

  // Animated reveal
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Comp>
  );
}
