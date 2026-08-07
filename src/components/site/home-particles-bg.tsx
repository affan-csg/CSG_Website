import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HeroCanvas = lazy(() => import("@/components/site/hero-canvas"));

/**
 * HomeParticlesBg — Full-page golden particles background for home page.
 * Renders behind all sections except footer and CTA band.
 */
export function HomeParticlesBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-50"
    >
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <HeroCanvas showRing={false} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
