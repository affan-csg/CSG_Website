import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";

// Lazy-load the 3D canvas component
const HeroCanvasComponent = lazy(() => import("@/components/site/hero-canvas"));

// Type for Network Information API
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

/**
 * LazyHeroCanvas — Golden particle background that renders immediately on normal devices.
 * Respects: prefers-reduced-motion, slow networks (2G/3G/save-data).
 * CRITICAL: Particles render with opacity-50 blend for visual continuity.
 */
export function LazyHeroCanvas({ showRing = true }: { showRing?: boolean }) {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference — completely skip on this device
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Check for slow network (if Network Information API available)
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: NetworkInformation;
    };
    const conn = nav.connection;
    const slowNetwork =
      conn?.saveData ||
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "3g";

    if (slowNetwork) {
      setIsSlowNetwork(true);
    }
  }, []);

  if (isSlowNetwork) {
    // Skip 3D on slow networks — show static fallback with grain texture
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='1' /%3E%3CfeColorMatrix type='saturate' values='0.3'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />
    );
  }

  // Normal devices: render golden particles immediately, minimal wrapper
  return (
    <ClientOnly fallback={null}>
      <Suspense fallback={null}>
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <HeroCanvasComponent showRing={showRing} />
        </div>
      </Suspense>
    </ClientOnly>
  );
}
