/**
 * Analytics integration for Core Web Vitals and performance metrics
 * Sends metrics to analytics service for monitoring
 */

import { CoreWebVitals, sendCoreWebVitals } from "./performance-monitor";

interface AnalyticsConfig {
  endpoint?: string; // Analytics endpoint URL
  enabled: boolean;
  batchSize: number; // Number of events before sending
  flushInterval: number; // MS between batch sends
}

let config: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === "production",
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
};

let eventQueue: Record<string, unknown>[] = [];
let flushTimer: NodeJS.Timeout | null = null;
let sessionId = "";

/**
 * Initialize analytics
 */
export function initAnalytics(customConfig: Partial<AnalyticsConfig> = {}) {
  if (typeof window === "undefined") return;

  config = { ...config, ...customConfig };

  // Generate session ID
  sessionId = generateSessionId();

  // Set up auto-flush on page unload
  window.addEventListener("beforeunload", () => {
    flushEvents();
  });

  // Start periodic flush timer
  if (config.flushInterval > 0) {
    flushTimer = setInterval(flushEvents, config.flushInterval) as unknown as NodeJS.Timeout;
  }

  // Send Core Web Vitals if endpoint is configured
  if (config.endpoint) {
    sendCoreWebVitals(config.endpoint, sessionId);
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!config.enabled) return;

  const event = {
    name: eventName,
    sessionId,
    timestamp: Date.now(),
    properties: properties || {},
    url: typeof window !== "undefined" ? window.location.href : "unknown",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
  };

  eventQueue.push(event);

  // Auto-flush if batch size reached
  if (eventQueue.length >= config.batchSize) {
    flushEvents();
  }
}

/**
 * Track page view
 */
export function trackPageView(pagePath?: string) {
  trackEvent("page_view", {
    path: pagePath || (typeof window !== "undefined" ? window.location.pathname : "unknown"),
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  success: boolean,
  duration?: number,
  errorMessage?: string,
) {
  trackEvent("form_submission", {
    formName,
    success,
    duration,
    errorMessage,
  });
}

/**
 * Track interaction
 */
export function trackInteraction(interactionType: string, target: string, duration?: number) {
  trackEvent("interaction", {
    type: interactionType,
    target,
    duration,
  });
}

/**
 * Track Core Web Vitals manually
 */
export function trackWebVitals(vitals: CoreWebVitals) {
  Object.entries(vitals).forEach(([metric, value]) => {
    if (value) {
      trackEvent("web_vital", {
        metric,
        value: value.value,
        rating: value.rating,
      });
    }
  });
}

/**
 * Track lazy-load performance
 */
export function trackLazyLoadPerformance(componentName: string, loadTime: number) {
  trackEvent("lazy_load", {
    component: componentName,
    loadTime,
  });
}

/**
 * Flush events to analytics endpoint
 */
export async function flushEvents() {
  if (!config.endpoint || eventQueue.length === 0) {
    return;
  }

  const eventsToSend = [...eventQueue];
  eventQueue = []; // Clear queue

  try {
    const payload = JSON.stringify({
      events: eventsToSend,
      timestamp: Date.now(),
    });

    // Use navigator.sendBeacon for reliability
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(config.endpoint, payload);
    } else {
      // Fallback to fetch
      await fetch(config.endpoint, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics should never break the app
        // Re-queue events for next flush
        eventQueue.unshift(...eventsToSend);
      });
    }
  } catch {
    // Silently fail and re-queue
    eventQueue.unshift(...eventsToSend);
  }
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cleanup analytics (stop timers)
 */
export function cleanupAnalytics() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  flushEvents();
}

/**
 * Get analytics config and status
 */
export function getAnalyticsStatus() {
  return {
    enabled: config.enabled,
    hasEndpoint: !!config.endpoint,
    queuedEvents: eventQueue.length,
    sessionId,
  };
}
