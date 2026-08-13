import { useEffect, useState } from "react";

/**
 * useReducedMotion — Hook to detect user's prefers-reduced-motion preference
 *
 * Returns true if user prefers reduced motion, false otherwise.
 * Respects system preference changes (e.g., accessibility settings toggle).
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * if (prefersReducedMotion) {
 *   return <StaticContent />;
 * }
 *
 * return <AnimatedContent />;
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check server-side if window is available
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Update state when preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * useMotionSafe — Returns safe motion props based on user preference
 *
 * Use this hook to safely apply motion/animation configurations.
 * Automatically disables animations if user prefers reduced motion.
 *
 * @example
 * const motionProps = useMotionSafe({
 *   animate: { x: 100 },
 *   transition: { duration: 0.5 }
 * });
 *
 * return <motion.div {...motionProps}>Content</motion.div>;
 */
export function useMotionSafe<T extends Record<string, unknown>>(motionProps: T): T | Partial<T> {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // Remove animation-related props
    return {
      ...motionProps,
      animate: undefined,
      exit: undefined,
      transition: { duration: 0 },
    };
  }

  return motionProps;
}

/**
 * usePrefersDarkMode — Hook to detect user's prefers-color-scheme preference
 *
 * Returns "dark" or "light" based on system preference.
 * Also respects changes to system preference.
 */
export function usePrefersDarkMode(): "dark" | "light" {
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return colorScheme;
}

/**
 * usePrefersHighContrast — Hook to detect user's prefers-contrast preference
 *
 * Returns true if user prefers high contrast.
 */
export function usePrefersHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-contrast: more)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: more)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersHighContrast;
}

/**
 * Check if user prefers reduced motion (static check)
 *
 * Use this in non-React contexts or for server-side checks.
 * For React components, use the useReducedMotion hook instead.
 */
export function checkReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration based on user preference
 *
 * @param normalDuration Duration in milliseconds when animations are enabled
 * @param returns 0 if reduced motion preferred, else normalDuration
 */
export function getAnimationDuration(normalDuration: number): number {
  return checkReducedMotion() ? 0 : normalDuration;
}

/**
 * Get transition delay based on user preference
 *
 * @param normalDelay Delay in milliseconds when animations are enabled
 * @returns 0 if reduced motion preferred, else normalDelay
 */
export function getTransitionDelay(normalDelay: number): number {
  return checkReducedMotion() ? 0 : normalDelay;
}
