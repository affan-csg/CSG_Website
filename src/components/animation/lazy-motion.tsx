import { Suspense, lazy, ReactNode } from "react";

// Lazy-load motion library only when animation components are used
const MotionDiv = lazy(() => import("motion/react").then((mod) => ({ default: mod.motion.div })));

const MotionSpan = lazy(() => import("motion/react").then((mod) => ({ default: mod.motion.span })));

const MotionSection = lazy(() =>
  import("motion/react").then((mod) => ({ default: mod.motion.section })),
);

const MotionArticle = lazy(() =>
  import("motion/react").then((mod) => ({ default: mod.motion.article })),
);

const MotionLi = lazy(() => import("motion/react").then((mod) => ({ default: mod.motion.li })));

// Fallback components for SSR/no-JS
function FallbackDiv({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function FallbackSpan({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

function FallbackSection({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={className}>{children}</section>;
}

function FallbackArticle({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={className}>{children}</article>;
}

function FallbackLi({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={className}>{children}</li>;
}

type ElementProps = {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
};

// Wrapper components with proper fallbacks
export function LazyMotionDiv(props: ElementProps) {
  return (
    <Suspense fallback={<FallbackDiv {...props} />}>
      <MotionDiv {...props} />
    </Suspense>
  );
}

export function LazyMotionSpan(props: ElementProps) {
  return (
    <Suspense fallback={<FallbackSpan {...props} />}>
      <MotionSpan {...props} />
    </Suspense>
  );
}

export function LazyMotionSection(props: ElementProps) {
  return (
    <Suspense fallback={<FallbackSection {...props} />}>
      <MotionSection {...props} />
    </Suspense>
  );
}

export function LazyMotionArticle(props: ElementProps) {
  return (
    <Suspense fallback={<FallbackArticle {...props} />}>
      <MotionArticle {...props} />
    </Suspense>
  );
}

export function LazyMotionLi(props: ElementProps) {
  return (
    <Suspense fallback={<FallbackLi {...props} />}>
      <MotionLi {...props} />
    </Suspense>
  );
}
