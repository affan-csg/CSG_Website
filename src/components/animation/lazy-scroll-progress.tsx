import { Suspense, lazy, useEffect, useState } from "react";

// Lazy-load the motion-based scroll progress
const ScrollProgressWithMotion = lazy(() => import("./scroll-progress-with-motion"));

/**
 * LazyScrollProgress — Defers loading motion library until user starts scrolling.
 * Reduces initial bundle size and improves FCP/LCP metrics.
 */
export function LazyScrollProgress() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasScrolled) {
    // Static progress bar during initial page load
    return (
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-gold"
        style={{ width: "0%" }}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-gold" />
      }
    >
      <ScrollProgressWithMotion />
    </Suspense>
  );
}
