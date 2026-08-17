import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";

// Lazy-load the 3D canvas component
const HeroCanvasComponent = lazy(() => import("@/components/site/hero-canvas"));

// Type for Network Information API
interface NetworkInformation {
  saveData?: boolean;
}

/**
 * LazyHeroCanvas — Golden particle background that renders immediately on normal devices.
 * Skipped only when the device has explicitly opted into data-saver mode.
 */
export function LazyHeroCanvas({ showRing = true }: { showRing?: boolean }) {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference — completely skip on this device
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Only respect an explicit data-saver opt-in — `effectiveType` is notoriously
    // unreliable (frequently reports 2g/3g on fast connections behind a VPN or
    // corporate proxy) and was hiding the golden particles for normal users.
    const nav = navigator as Navigator & {
      connection?: NetworkInformation;
    };
    if (nav.connection?.saveData) {
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
