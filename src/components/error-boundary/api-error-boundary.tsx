import { ReactNode } from "react";
import { ErrorBoundary } from "./error-boundary";

interface ApiErrorBoundaryProps {
  children: ReactNode;
  boundary?: string;
  retryable?: boolean;
  onRetry?: () => void;
}

/**
 * APIErrorBoundary — Handles errors from API calls and data fetching
 * Provides retry mechanisms for transient failures
 */
export function ApiErrorBoundary({
  children,
  boundary = "api-call",
  retryable = true,
  onRetry,
}: ApiErrorBoundaryProps) {
  return (
    <ErrorBoundary
      boundary={boundary}
      level="section"
      fallback={(error, reset) => (
        <ApiErrorFallback
          error={error}
          retryable={retryable}
          onReset={() => {
            reset();
            onRetry?.();
          }}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

interface ApiErrorFallbackProps {
  error: Error;
  retryable: boolean;
  onReset: () => void;
}

function ApiErrorFallback({ error, retryable, onReset }: ApiErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === "development";
  const isNetworkError = error.message.includes("fetch") || error.message.includes("Network");
  const isTimeoutError = error.message.includes("timeout") || error.message.includes("504");

  let title = "Failed to load data";
  let message = "We couldn't retrieve the information. Please try again.";

  if (isNetworkError) {
    title = "Network error";
    message = "Check your connection and try again.";
  } else if (isTimeoutError) {
    title = "Server timeout";
    message = "The request took too long. Please try again.";
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h3 className="mb-2 font-semibold text-red-900">{title}</h3>
      <p className="mb-4 text-sm text-red-800">{message}</p>

      {isDev && (
        <details className="mb-4">
          <summary className="cursor-pointer text-xs font-mono text-red-700">Error details</summary>
          <pre className="mt-2 overflow-auto rounded-md bg-red-100 p-2 text-xs text-red-900">
            {error.message}
            {error.stack && `\n${error.stack}`}
          </pre>
        </details>
      )}

      {retryable && (
        <button
          onClick={onReset}
          className="rounded-md bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/**
 * Typed API error for better error handling
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Safe fetch wrapper with error handling
 */
export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let details: Record<string, unknown> | undefined;
      try {
        details = await response.json();
      } catch {
        // Response is not JSON, skip details
      }

      throw new ApiError(
        response.status,
        response.statusText,
        `Failed to fetch ${url}: ${response.statusText}`,
        details,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new ApiError(0, "Unknown", `Fetch error: ${message}`);
  }
}

/**
 * Create a safe API call with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if not a network/timeout error
      if (
        lastError.message.includes("401") ||
        lastError.message.includes("403") ||
        lastError.message.includes("404")
      ) {
        throw lastError;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("Max retries exceeded");
}
