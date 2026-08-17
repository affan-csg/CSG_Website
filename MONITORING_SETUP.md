# Monitoring & Analytics Setup Guide

This guide covers setting up error tracking, analytics, and accessibility testing for production monitoring.

---

## 📋 Overview

The project includes built-in infrastructure for:

- **Error Tracking** — Capture unhandled errors and exceptions
- **Performance Analytics** — Monitor Core Web Vitals and custom metrics
- **Accessibility Testing** — Automated WCAG AA compliance checks

---

## 🔴 Error Tracking Setup

### What's Included

- Capture unhandled JavaScript errors
- Track unhandled promise rejections
- Send errors to external monitoring service
- User context and error metadata

### Configuration

#### 1. Set Environment Variable

Add your error tracking service DSN to `.env.production`:

```env
# For Sentry
NEXT_PUBLIC_ERROR_TRACKING_DSN=https://your-key@sentry.io/project-id

# For other services, update the endpoint accordingly
```

#### 2. Initialize in Root Component

In `src/routes/__root.tsx`:

```typescript
import { initializeMonitoring } from "@/lib/initialize-monitoring";

function RootComponent() {
  useEffect(() => {
    initializeMonitoring({
      errorTracking: {
        dsn: process.env.NEXT_PUBLIC_ERROR_TRACKING_DSN,
        enabled: true,
      },
    });
  }, []);

  return (
    // ... your component
  );
}
```

#### 3. Supported Services

- **Sentry** (recommended) — https://sentry.io/
- **Datadog** — https://www.datadoghq.com/
- **Rollbar** — https://rollbar.com/
- **Bugsnag** — https://www.bugsnag.com/
- Custom endpoint — Implement your own collector

### API Reference

#### `initErrorTracking(config)`

Initialize error tracking with custom config:

```typescript
import { initErrorTracking } from "@/lib/error-tracking";

initErrorTracking({
  dsn: "https://your-key@sentry.io/project-id",
  environment: "production",
  tracesSampleRate: 0.1, // Sample 10% of errors in production
});
```

#### `captureError(error, context)`

Manually capture an error:

```typescript
import { captureError } from "@/lib/error-tracking";

try {
  // risky operation
} catch (error) {
  captureError(error, {
    operation: "critical_task",
    severity: "high",
  });
}
```

#### `setUserContext(userId, email, name)`

Associate errors with user:

```typescript
import { setUserContext } from "@/lib/error-tracking";

setUserContext("user-123", "user@example.com", "John Doe");
```

---

## 📊 Analytics & Performance Monitoring

### What's Included

- Core Web Vitals tracking (LCP, INP, CLS, FCP, TTFB)
- Custom event tracking
- Form submission tracking
- Page view tracking
- Session-based analytics

### Configuration

#### 1. Set Analytics Endpoint

Add analytics endpoint to `.env.production`:

```env
# Your analytics collector endpoint
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://analytics.example.com/collect
```

#### 2. Initialize in Root Component

```typescript
import { initializeMonitoring } from "@/lib/initialize-monitoring";

function RootComponent() {
  useEffect(() => {
    initializeMonitoring({
      analytics: {
        endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
        trackPageViews: true,
        enabled: true,
      },
    });
  }, []);

  return (
    // ... your component
  );
}
```

#### 3. Supported Services

- **Google Analytics 4** — https://analytics.google.com/
- **Segment** — https://segment.com/
- **Mixpanel** — https://mixpanel.com/
- **Amplitude** — https://amplitude.com/
- **Custom Endpoint** — POST `/collect` endpoint

### API Reference

#### `trackEvent(eventName, properties)`

Track custom events:

```typescript
import { trackEvent } from "@/lib/analytics-integration";

trackEvent("feature_used", {
  feature: "export_report",
  duration: 1234,
  success: true,
});
```

#### `trackFormSubmission(formName, success, duration, errorMessage)`

Track form submissions:

```typescript
import { trackFormSubmission } from "@/lib/analytics-integration";

trackFormSubmission("contact_form", true, 500);
```

#### `trackPageView(path)`

Track page navigation:

```typescript
import { trackPageView } from "@/lib/analytics-integration";

trackPageView("/staffing/developers");
```

#### `trackWebVitals(vitals)`

Send Core Web Vitals:

```typescript
import { trackWebVitals, collectCoreWebVitals } from "@/lib/analytics-integration";
import { collectCoreWebVitals } from "@/lib/performance-monitor";

const vitals = collectCoreWebVitals();
trackWebVitals(vitals);
```

---

## ♿ Accessibility Testing

### What's Included

- Automated WCAG AA compliance checks
- Heading hierarchy validation
- Keyboard navigation testing
- Focus indicator verification
- Color contrast validation
- Alt text checks
- Screen reader compatibility checks

### Running Accessibility Tests

#### Local Testing

Run accessibility tests locally:

```bash
# Run all accessibility tests
pnpm test:a11y

# Run with UI
pnpm test:a11y -- --ui

# Debug mode
pnpm test:a11y -- --debug
```

#### CI/CD Pipeline

Accessibility tests run automatically on:

- Push to `main` or `develop`
- Pull requests

Tests are defined in `e2e/accessibility.spec.ts`

### What's Tested

1. **WCAG AA Violations** — Using axe-core library
2. **Heading Hierarchy** — No skipped heading levels
3. **Keyboard Navigation** — Tab through interactive elements
4. **Focus Indicators** — Visible focus states
5. **Color Contrast** — 4.5:1 minimum for body text
6. **Alt Text** — Images have alt text or aria-labels
7. **Form Labels** — Labels associated with inputs
8. **Reduced Motion** — Respects `prefers-reduced-motion`
9. **Skip Links** — Skip to main content functionality

### Viewing Reports

After running tests, view detailed reports:

```bash
# Open last Playwright report
pnpm exec playwright show-report
```

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

Automated testing runs on every push/PR:

```bash
# Run all checks locally (as CI does)
pnpm test:all
```

This runs:

1. Linting (`pnpm lint`)
2. Type checking (`pnpm type-check`)
3. Unit tests (`pnpm test`)
4. E2E tests (`pnpm test:e2e`)
5. Accessibility tests (`pnpm test:a11y`)
6. Performance checks (bundle size)
7. Security scan (`pnpm audit`)

### Workflow Files

- `.github/workflows/test.yml` — Comprehensive test suite

---

## 📈 Analytics Data Format

### Events Sent to Analytics

```json
{
  "events": [
    {
      "name": "page_view",
      "sessionId": "1234567890-abcdef123",
      "timestamp": 1629567890000,
      "properties": {
        "path": "/staffing/developers"
      },
      "url": "https://careersourcegroup.com/staffing/developers",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "name": "form_submission",
      "sessionId": "1234567890-abcdef123",
      "timestamp": 1629567895000,
      "properties": {
        "formName": "contact_form",
        "success": true,
        "duration": 1500
      }
    },
    {
      "name": "web_vital",
      "sessionId": "1234567890-abcdef123",
      "timestamp": 1629567900000,
      "properties": {
        "metric": "LCP",
        "value": 2500,
        "rating": "good"
      }
    }
  ],
  "timestamp": 1629567900000
}
```

### Error Data Format

```json
{
  "message": "Cannot read property 'id' of undefined",
  "stack": "Error: Cannot read property 'id' of undefined\n  at Object.<anonymous> (app.js:42:10)",
  "type": "TypeError",
  "context": {
    "operation": "fetch_user",
    "severity": "high"
  },
  "timestamp": "2024-08-13T20:30:45.123Z",
  "environment": "production",
  "userAgent": "Mozilla/5.0...",
  "url": "https://careersourcegroup.com/contact"
}
```

---

## 🔧 Troubleshooting

### Events Not Sending

1. Check that analytics endpoint is configured
2. Verify endpoint accepts POST requests
3. Check browser console for errors
4. Ensure events are being queued: `getAnalyticsStatus()`

### Errors Not Being Captured

1. Check that error tracking DSN is set
2. Verify service is accepting requests
3. Check browser console for error tracking initialization
4. Use `getErrorTrackingConfig()` to verify settings

### Accessibility Tests Failing

1. Run tests locally: `pnpm test:a11y`
2. View detailed report: `pnpm exec playwright show-report`
3. Fix issues in components
4. Re-run to verify fixes

---

## 📚 Resources

- [Core Web Vitals Guide](https://web.dev/vitals/)
- [WCAG 2.1 Standards](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Sentry Documentation](https://docs.sentry.io/)
- [Playwright Testing](https://playwright.dev/docs/intro)

---

## ✅ Checklist for Production Deployment

- [ ] Set `NEXT_PUBLIC_ERROR_TRACKING_DSN` in production `.env`
- [ ] Set `NEXT_PUBLIC_ANALYTICS_ENDPOINT` in production `.env`
- [ ] Initialize monitoring in root component
- [ ] Run full test suite: `pnpm test:all`
- [ ] Verify error tracking is working
- [ ] Verify analytics collection is working
- [ ] Check CI/CD pipeline passes all checks
- [ ] Monitor error tracking service after deployment
- [ ] Check analytics dashboard for data

---

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review error tracking service documentation
3. Check analytics collector logs
4. Run local tests to reproduce issues
