/**
 * Initialize all monitoring and tracking for production
 * Call this once in your root component during app initialization
 */

import { initErrorTracking, captureMessage } from "./error-tracking";
import { initAnalytics, trackPageView } from "./analytics-integration";

/**
 * Configuration for monitoring services
 */
export interface MonitoringConfig {
  errorTracking?: {
    enabled?: boolean;
    dsn?: string; // Sentry DSN or similar
    environment?: "development" | "production" | "staging";
  };
  analytics?: {
    enabled?: boolean;
    endpoint?: string; // Analytics collector endpoint
    trackPageViews?: boolean;
  };
}

/**
 * Initialize all monitoring systems
 * Should be called once during app startup in your root component
 *
 * @example
 * useEffect(() => {
 *   initializeMonitoring({
 *     errorTracking: {
 *       dsn: process.env.NEXT_PUBLIC_ERROR_TRACKING_DSN,
 *     },
 *     analytics: {
 *       endpoint: '/api/analytics',
 *     },
 *   });
 * }, []);
 */
export function initializeMonitoring(config: MonitoringConfig = {}) {
  // Only initialize on client-side
  if (typeof window === "undefined") {
    return;
  }

  const environment = process.env.NODE_ENV === "production" ? "production" : "development";

  // Initialize error tracking
  if (config.errorTracking?.enabled !== false) {
    initErrorTracking({
      dsn: config.errorTracking?.dsn,
      environment: config.errorTracking?.environment || environment,
      tracesSampleRate: environment === "production" ? 0.1 : 1.0,
    });

    // Log startup message in development
    if (environment === "development") {
      captureMessage("Error tracking initialized", "info");
    }
  }

  // Initialize analytics
  if (config.analytics?.enabled !== false) {
    initAnalytics({
      endpoint: config.analytics?.endpoint,
      enabled: true,
      batchSize: 10,
      flushInterval: 30000,
    });

    // Track initial page view
    if (config.analytics?.trackPageViews !== false) {
      trackPageView();
    }

    // Log startup message in development
    if (environment === "development") {
      console.log("Analytics initialized", {
        endpoint: config.analytics?.endpoint || "none",
      });
    }
  }

  // Set up cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (config.analytics?.enabled !== false) {
      // Flush any pending analytics events
      const flushModule = import("./analytics-integration");
      flushModule.then((m) => m.flushEvents()).catch(() => {
        // Silently fail
      });
    }
  });

  // Log successful initialization
  if (environment === "development") {
    console.log("✓ Monitoring systems initialized");
  }
}

/**
 * Get monitoring status
 */
export async function getMonitoringStatus() {
  if (typeof window === "undefined") {
    return { error: "Not available on server" };
  }

  const { getErrorTrackingConfig } = await import("./error-tracking");
  const { getAnalyticsStatus } = await import("./analytics-integration");

  return {
    errorTracking: getErrorTrackingConfig(),
    analytics: getAnalyticsStatus(),
  };
}
