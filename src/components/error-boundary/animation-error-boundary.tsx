import { ReactNode } from "react";
import { ErrorBoundary } from "./error-boundary";

interface AnimationErrorBoundaryProps {
  children: ReactNode;
  boundary?: string;
  graceful?: boolean;
}

/**
 * AnimationErrorBoundary — Specialized for animation/lazy-load components
 * Falls back to static version if animation library fails to load
 */
export function AnimationErrorBoundary({
  children,
  boundary = "animation",
  graceful = true,
}: AnimationErrorBoundaryProps) {
  return (
    <ErrorBoundary
      boundary={boundary}
      level="component"
      fallback={(error, reset) => {
        if (!graceful) {
          return (
            <div className="flex flex-col gap-2 rounded-md bg-orange-50 p-3">
              <p className="text-sm font-medium text-orange-900">Animation failed</p>
              <button
                onClick={reset}
                className="text-xs font-medium text-orange-700 hover:text-orange-900"
              >
                Retry
              </button>
            </div>
          );
        }

        // Graceful: render children without animation (static fallback)
        return <>{children}</>;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Safe animation wrapper for GSAP, Framer Motion, etc.
 */
export function createSafeAnimation<T extends object>(
  animationConfig: T,
  onError?: (error: Error) => void,
): T {
  try {
    // Validate animation config
    if (!animationConfig || typeof animationConfig !== "object") {
      throw new Error("Invalid animation configuration");
    }
    return animationConfig;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    // Return safe defaults instead of throwing
    return {} as T;
  }
}

/**
 * Wrap requestAnimationFrame with error handling
 */
export function safeRequestAnimationFrame(callback: FrameRequestCallback): number {
  return requestAnimationFrame((time) => {
    try {
      callback(time);
    } catch (error) {
      console.error("Animation frame error:", error);
    }
  });
}

/**
 * Wrap setTimeout/setInterval with error handling
 */
export function safeSetTimeout(callback: () => void, delay?: number): NodeJS.Timeout {
  return setTimeout(() => {
    try {
      callback();
    } catch (error) {
      console.error("Timeout error:", error);
    }
  }, delay);
}

export function safeSetInterval(callback: () => void, delay?: number): NodeJS.Timer {
  return setInterval(() => {
    try {
      callback();
    } catch (error) {
      console.error("Interval error:", error);
    }
  }, delay);
}
