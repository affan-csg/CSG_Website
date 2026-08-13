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
 * LazyHeroCanvas — Intelligent 3D canvas lazy-loading with respects for:
 * - Prefers-reduced-motion
 * - Low-end devices (via media queries)
 * - Network speed (4G vs slower)
 * - User interaction readiness
 */
export function LazyHeroCanvas({ showRing = true }: { showRing?: boolean }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Check for low-end device (max-width < 768px typically has worse GPU)
    const nav = navigator as Navigator & { deviceMemory?: number };
    const isLowEndDevice =
      window.matchMedia("(max-width: 768px)").matches && nav.deviceMemory && nav.deviceMemory < 4;

    // Check for slow network (if Network Information API available)
    const conn = navigator.connection as NetworkInformation | undefined;
    const slowNetwork =
      conn?.saveData ||
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "3g";

    if (slowNetwork) {
      setIsSlowNetwork(true);
      return;
    }

    // On low-end devices, only render if user explicitly requests it
    if (isLowEndDevice) {
      // Could implement a "load animation" button here
      // For now, skip rendering
      return;
    }

    // For normal devices, render after initial paint
    const timeout = requestIdleCallback(() => {
      setShouldRender(true);
    });

    return () => {
      if (typeof timeout === "number") {
        cancelIdleCallback(timeout);
      }
    };
  }, []);

  if (isSlowNetwork) {
    // Skip 3D on slow networks
    return null;
  }

  if (!shouldRender) {
    // Static placeholder with grain texture
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='1' /%3E%3CfeColorMatrix type='saturate' values='0.3'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-50">
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <HeroCanvasComponent showRing={showRing} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
