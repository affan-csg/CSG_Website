import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "./error-boundary";

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  boundary?: string;
}

/**
 * AsyncErrorBoundary — Wraps async operations with both Suspense and ErrorBoundary
 * Handles loading states and async errors gracefully
 */
export function AsyncErrorBoundary({
  children,
  fallback: _fallback,
  loadingFallback,
  boundary = "async-operation",
}: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary boundary={boundary} level="section">
      <Suspense fallback={loadingFallback ?? <LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-48 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Wraps form submissions with error boundaries
 */
export function createSafeFormHandler<T extends Record<string, unknown>>(
  handler: (data: T) => Promise<void>,
  onError?: (error: Error) => void,
): (data: T) => Promise<void> {
  return async (data: T) => {
    try {
      await handler(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
      throw err;
    }
  };
}

/**
 * Safe async hook effect wrapper
 */
export async function safeAsyncEffect(
  fn: () => Promise<void> | void,
  cleanup?: () => void,
): Promise<() => void> {
  try {
    await fn();
  } catch (error) {
    console.error("Async effect error:", error);
  }

  return () => {
    cleanup?.();
  };
}
