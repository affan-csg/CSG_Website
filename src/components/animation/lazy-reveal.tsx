import { Suspense, lazy, ReactNode, useEffect, useRef, useState, type ComponentType } from "react";

// Lazy-load the heavy reveal animation component
const RevealWithMotion = lazy(() => import("./reveal-with-motion"));

/**
 * LazyReveal — Defers loading of motion library until component is about to enter viewport.
 * Uses IntersectionObserver with margin to start loading 200px before visibility.
 */
export function LazyReveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return; // Already decided to load

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        // Start loading 200px before the element enters viewport
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  // Render static version during SSR and while loading
  const StaticComponent = as as unknown as ComponentType<{
    children?: ReactNode;
    className?: string | undefined;
  }>;

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <Suspense fallback={<StaticComponent className={className}>{children}</StaticComponent>}>
          <RevealWithMotion delay={delay} y={y} className={className} as={as}>
            {children}
          </RevealWithMotion>
        </Suspense>
      ) : (
        <StaticComponent className={className}>{children}</StaticComponent>
      )}
    </div>
  );
}

/**
 * LazyRevealGroup — Staggers LazyReveal children.
 */
export function LazyRevealGroup({
  children,
  className,
  step = 0.07,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
}) {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleIndex(0);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => {
        const shouldLoad = visibleIndex >= 0;
        const delay = i * step;

        return (
          <div key={i}>
            {shouldLoad ? (
              <Suspense fallback={<div>{child}</div>}>
                <LazyReveal delay={delay}>{child}</LazyReveal>
              </Suspense>
            ) : (
              <div>{child}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
