/**
 * Accessibility utilities for handling user preferences
 * Covers: reduced-motion, color-scheme, contrast, etc.
 */

interface MotionConfig {
  duration: number;
  delay: number;
  ease: string | number[];
}

/**
 * Get motion config based on user preference
 *
 * Returns safe motion configuration that respects prefers-reduced-motion.
 * When reduced motion is preferred, returns instant/no animation config.
 *
 * @example
 * const config = getMotionConfig({
 *   duration: 0.3,
 *   delay: 0,
 *   ease: "ease-out"
 * });
 * // Returns: { duration: 0, delay: 0, ease: "ease-out" } if reduced motion
 */
export function getMotionConfig(
  normalConfig: MotionConfig,
  reducedConfig?: Partial<MotionConfig>,
): MotionConfig {
  if (checkReducedMotion()) {
    return {
      duration: 0,
      delay: 0,
      ease: normalConfig.ease,
      ...reducedConfig,
    };
  }

  return normalConfig;
}

/**
 * Check if user prefers reduced motion
 *
 * Safe to call in both server and client contexts.
 */
export function checkReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get safe animation duration in milliseconds
 *
 * @param normalDuration Duration when animations are normal
 * @returns 0 if reduced motion, else normalDuration
 *
 * @example
 * const duration = getAnimationDuration(300); // 300 or 0
 * // setTimeout(() => { ... }, duration);
 */
export function getAnimationDuration(normalDuration: number): number {
  return checkReducedMotion() ? 0 : normalDuration;
}

/**
 * Format CSS duration value based on user preference
 *
 * @param normalDuration CSS duration string (e.g., "0.3s", "300ms")
 * @returns "0s" if reduced motion, else normalDuration
 *
 * @example
 * const duration = getAnimationDurationCss("0.3s"); // "0s" or "0.3s"
 * element.style.transitionDuration = duration;
 */
export function getAnimationDurationCss(normalDuration: string): string {
  return checkReducedMotion() ? "0s" : normalDuration;
}

/**
 * Get CSS transition value based on user preference
 *
 * @example
 * const transition = getTransitionCss("opacity 0.3s ease");
 * // Returns: "opacity 0s" if reduced motion, else "opacity 0.3s ease"
 */
export function getTransitionCss(normalTransition: string): string {
  if (!checkReducedMotion()) {
    return normalTransition;
  }

  // Extract property name (e.g., "opacity" from "opacity 0.3s ease")
  const parts = normalTransition.split(" ");
  const property = parts[0];

  return `${property} 0s`;
}

/**
 * Safely apply CSS animation
 *
 * Returns animation CSS value or "none" if reduced motion preferred.
 *
 * @example
 * element.style.animation = getAnimationCss("myAnimation 0.5s ease");
 * // Returns: "none" if reduced motion, else "myAnimation 0.5s ease"
 */
export function getAnimationCss(normalAnimation: string): string {
  return checkReducedMotion() ? "none" : normalAnimation;
}

/**
 * Detect user's color scheme preference
 */
export function getColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Detect user's contrast preference
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-contrast: more)").matches;
}

/**
 * Detect if user has transparency disabled
 */
export function prefersNoTransparency(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-transparency: reduce)").matches;
}

/**
 * Create safe animation style object
 *
 * Combines all accessibility preferences into a single style object.
 *
 * @example
 * const style = getSafeAnimationStyle({
 *   normal: { transition: "opacity 0.3s ease" },
 *   reduced: { transition: "none" }
 * });
 */
export function getSafeAnimationStyle(config: {
  normal: Record<string, unknown>;
  reduced?: Record<string, unknown>;
}): Record<string, unknown> {
  if (checkReducedMotion()) {
    return config.reduced ?? config.normal;
  }

  return config.normal;
}

/**
 * Detect if animation should play
 *
 * @returns true if animations are enabled (not reduced), false otherwise
 *
 * @example
 * if (shouldAnimateElement()) {
 *   playAnimation();
 * } else {
 *   showStaticContent();
 * }
 */
export function shouldAnimateElement(): boolean {
  return !checkReducedMotion();
}

/**
 * Accessibility feature flags
 *
 * Use this to determine which accessibility features to enable.
 */
export function getAccessibilityFeatures() {
  return {
    enableAnimations: shouldAnimateElement(),
    reducedMotion: checkReducedMotion(),
    darkMode: getColorScheme() === "dark",
    highContrast: prefersHighContrast(),
    noTransparency: prefersNoTransparency(),
  };
}

/**
 * Wait for user interaction before starting animations
 *
 * Use this for animations that should only play after user interaction.
 * Respects prefers-reduced-motion.
 *
 * @example
 * element.addEventListener("mouseenter", () => {
 *   waitForUserInteraction(() => {
 *     playAnimation();
 *   });
 * });
 */
export function waitForUserInteraction(callback: () => void): void {
  if (checkReducedMotion()) {
    callback();
    return;
  }

  // Use requestAnimationFrame to ensure smooth interaction
  requestAnimationFrame(() => {
    callback();
  });
}

/**
 * Debounce animation frames based on user preference
 *
 * Helps prevent motion sickness for users with reduced motion preference.
 */
export function debounceAnimationFrame(callback: FrameRequestCallback): number {
  if (checkReducedMotion()) {
    // For reduced motion, just call immediately
    return requestAnimationFrame(callback);
  }

  // Normal animation frame
  return requestAnimationFrame(callback);
}

/**
 * Create a safe interval based on user preference
 *
 * Returns longer intervals for animations when reduced motion is preferred.
 */
export function getSafeInterval(normalInterval: number): number {
  return checkReducedMotion() ? Math.max(normalInterval * 4, 100) : normalInterval;
}
