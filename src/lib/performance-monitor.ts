/**
 * Performance monitoring utilities for tracking Core Web Vitals
 * and lazy-loading effectiveness.
 */

type PerformanceMetric = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
};

export interface CoreWebVitals {
  LCP?: PerformanceMetric; // Largest Contentful Paint
  FID?: PerformanceMetric; // First Input Delay (deprecated, using INP instead)
  INP?: PerformanceMetric; // Interaction to Next Paint
  CLS?: PerformanceMetric; // Cumulative Layout Shift
  TTFB?: PerformanceMetric; // Time to First Byte
  FCP?: PerformanceMetric; // First Contentful Paint
}

/**
 * Get rating for LCP (Largest Contentful Paint)
 * Good: <= 2500ms, Needs improvement: <= 4000ms, Poor: > 4000ms
 */
function getLCPRating(value: number): "good" | "needs-improvement" | "poor" {
  if (value <= 2500) return "good";
  if (value <= 4000) return "needs-improvement";
  return "poor";
}

/**
 * Get rating for INP (Interaction to Next Paint)
 * Good: <= 200ms, Needs improvement: <= 500ms, Poor: > 500ms
 */
function getINPRating(value: number): "good" | "needs-improvement" | "poor" {
  if (value <= 200) return "good";
  if (value <= 500) return "needs-improvement";
  return "poor";
}

/**
 * Get rating for CLS (Cumulative Layout Shift)
 * Good: <= 0.1, Needs improvement: <= 0.25, Poor: > 0.25
 */
function getCLSRating(value: number): "good" | "needs-improvement" | "poor" {
  if (value <= 0.1) return "good";
  if (value <= 0.25) return "needs-improvement";
  return "poor";
}

/**
 * Collect Core Web Vitals metrics
 */
export function collectCoreWebVitals(): CoreWebVitals {
  const vitals: CoreWebVitals = {};

  // Use Performance Observer API if available
  if ("PerformanceObserver" in window) {
    try {
      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntryWithStartTime;
        if (lastEntry.startTime !== undefined) {
          vitals.LCP = {
            name: "LCP",
            value: Math.round(lastEntry.startTime),
            rating: getLCPRating(lastEntry.startTime),
            timestamp: Date.now(),
          };
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntry[]) {
          if ("hadRecentInput" in entry && !entry.hadRecentInput && "value" in entry) {
            clsValue += (entry as Record<string, number>).value;
            vitals.CLS = {
              name: "CLS",
              value: clsValue,
              rating: getCLSRating(clsValue),
              timestamp: Date.now(),
            };
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      // INP - Interaction to Next Paint (replaces FID)
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntry[];
        const maxDuration = Math.max(...entries.map((e) => e.duration ?? 0));
        vitals.INP = {
          name: "INP",
          value: Math.round(maxDuration),
          rating: getINPRating(maxDuration),
          timestamp: Date.now(),
        };
      });
      inpObserver.observe({ type: "interaction", buffered: true });

      // FCP - First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === "first-contentful-paint") {
            vitals.FCP = {
              name: "FCP",
              value: Math.round(entry.startTime),
              rating: getLCPRating(entry.startTime), // Reuse LCP thresholds
              timestamp: Date.now(),
            };
          }
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch (error) {
      console.debug("PerformanceObserver error:", error);
    }
  }

  // Get Navigation Timing metrics
  try {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart;
      vitals.TTFB = {
        name: "TTFB",
        value: Math.round(ttfb),
        rating: ttfb <= 600 ? "good" : ttfb <= 1800 ? "needs-improvement" : "poor",
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.debug("Navigation timing error:", error);
  }

  return vitals;
}

/**
 * Log Core Web Vitals to console (dev only)
 */
export function logCoreWebVitals(): void {
  if (process.env.NODE_ENV !== "production") {
    const vitals = collectCoreWebVitals();

    console.group("📊 Core Web Vitals");
    Object.entries(vitals).forEach(([_key, metric]) => {
      if (metric) {
        const emoji =
          metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "❌";
        console.log(`${emoji} ${metric.name}: ${metric.value}ms (${metric.rating})`);
      }
    });
    console.groupEnd();
  }
}

/**
 * Send Core Web Vitals to analytics service
 */
export function sendCoreWebVitals(analyticsEndpoint: string, sessionId: string): void {
  if (typeof window === "undefined") return;

  // Wait for page to stabilize before collecting
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      sendMetrics();
    });
  } else {
    sendMetrics();
  }

  function sendMetrics() {
    // Additional delay to let all metrics settle
    setTimeout(() => {
      const vitals = collectCoreWebVitals();

      // Filter out undefined metrics
      const metrics = Object.entries(vitals)
        .filter(([, metric]) => metric !== undefined)
        .reduce((acc, [key, metric]) => {
          acc[key] = metric;
          return acc;
        }, {} as CoreWebVitals);

      // Send to analytics
      try {
        navigator.sendBeacon(
          analyticsEndpoint,
          JSON.stringify({
            sessionId,
            timestamp: Date.now(),
            vitals: metrics,
            url: window.location.href,
          }),
        );
      } catch (error) {
        console.debug("Failed to send metrics:", error);
      }
    }, 5000); // Wait 5s for all metrics to be available
  }
}

/**
 * Track lazy-load events
 */
export function trackLazyLoad(componentName: string, loadTime: number): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`⏱️ [Lazy-Load] ${componentName}: ${loadTime.toFixed(2)}ms`);
  }

  // Send to analytics if available
  const analyticsWindow = window as Record<string, unknown>;
  if (typeof window !== "undefined" && analyticsWindow.__ANALYTICS__) {
    const analytics = analyticsWindow.__ANALYTICS__ as Record<
      string,
      (event: string, data: Record<string, unknown>) => void
    >;
    analytics.track("lazy_load", {
      component: componentName,
      time: loadTime,
    });
  }
}

/**
 * Measure component render time
 */
export function measureComponentRender(name: string, renderFn: () => void): number {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  const duration = end - start;

  trackLazyLoad(name, duration);
  return duration;
}

// Performance mark helpers for debugging
export function markStart(name: string): void {
  if (typeof performance !== "undefined") {
    performance.mark(`${name}-start`);
  }
}

export function markEnd(name: string): void {
  if (typeof performance !== "undefined") {
    performance.mark(`${name}-end`);
    try {
      performance.measure(name, `${name}-start`, `${name}-end`);
      const measure = performance.getEntriesByName(name)[0];
      if (measure && process.env.NODE_ENV !== "production") {
        console.debug(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
      }
    } catch {
      // Marks may not exist if script is reloaded
    }
  }
}

type PerformanceEntryWithStartTime = PerformanceEntry & { startTime: number };
