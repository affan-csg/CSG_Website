/**
 * Error tracking integration for production
 * Captures unhandled errors and sends them to monitoring service
 */

interface ErrorTrackingConfig {
  dsn?: string; // Sentry DSN or similar service endpoint
  environment: "development" | "production" | "staging";
  tracesSampleRate?: number; // 0.0 to 1.0
  enableConsoleCapture?: boolean;
}

let config: ErrorTrackingConfig = {
  environment: process.env.NODE_ENV === "production" ? "production" : "development",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  enableConsoleCapture: true,
};

/**
 * Initialize error tracking
 */
export function initErrorTracking(customConfig: Partial<ErrorTrackingConfig> = {}) {
  config = { ...config, ...customConfig };

  if (typeof window === "undefined") {
    return; // Server-side error tracking handled separately
  }

  // Set up global error handler
  window.addEventListener("error", (event) => {
    captureError(event.error, {
      type: "uncaught_error",
      message: event.message,
    });
  });

  // Set up unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    captureError(event.reason, {
      type: "unhandled_rejection",
    });
  });
}

/**
 * Capture error event
 */
export function captureError(
  error: Error | unknown,
  context?: Record<string, unknown>,
) {
  if (!config.dsn) {
    // No error tracking configured - just log to console in dev
    if (config.environment === "development") {
      console.error("Error captured (not sent - no DSN configured):", error, context);
    }
    return;
  }

  const errorData = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    type: error instanceof Error ? error.name : "Unknown",
    context: context || {},
    timestamp: new Date().toISOString(),
    environment: config.environment,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    url: typeof window !== "undefined" ? window.location.href : "unknown",
  };

  // Send to error tracking service
  sendToErrorTracking(errorData);
}

/**
 * Capture exception with additional context
 */
export function captureException(
  error: Error,
  tags?: Record<string, string>,
  level?: "fatal" | "error" | "warning" | "info" | "debug",
) {
  captureError(error, {
    tags: tags || {},
    level: level || "error",
  });
}

/**
 * Capture message
 */
export function captureMessage(message: string, level?: "fatal" | "error" | "warning" | "info" | "debug") {
  if (!config.dsn) {
    if (config.environment === "development") {
      console.log("Message captured:", message, level);
    }
    return;
  }

  sendToErrorTracking({
    message,
    level: level || "info",
    type: "message",
    timestamp: new Date().toISOString(),
    environment: config.environment,
  });
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId?: string, email?: string, name?: string) {
  if (typeof window === "undefined") return;

  // Store in window for error tracking
  (window as any).__errorTrackingUser = {
    id: userId,
    email,
    name,
  };
}

/**
 * Send error to tracking service (implementation)
 */
async function sendToErrorTracking(errorData: Record<string, unknown>) {
  if (!config.dsn) return;

  try {
    const payload = JSON.stringify(errorData);

    // Use navigator.sendBeacon for reliability (queues even if page unloads)
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(config.dsn, payload);
    } else {
      // Fallback to fetch with no-cors
      await fetch(config.dsn, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't let error tracking break the app
      });
    }
  } catch {
    // Silently fail - error tracking should never break the app
  }
}

/**
 * Get error tracking status
 */
export function getErrorTrackingConfig(): ErrorTrackingConfig {
  return config;
}
