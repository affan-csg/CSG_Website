import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HeroCanvas = lazy(() => import("@/components/site/hero-canvas"));

/**
 * HeroParticles — Reusable particle effect for hero sections
 */
export function HeroParticles({ showRing = true }: { showRing?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 -z-10">
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <HeroCanvas showRing={showRing} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
