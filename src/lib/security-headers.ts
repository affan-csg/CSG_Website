import crypto from "crypto";

export function generateNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

export function getSecurityHeaders(nonce: string): Record<string, string> {
  // In development, use permissive CSP to allow Vite HMR and external resources
  // In production, use strict nonce-based CSP
  const isProduction = process.env["NODE_ENV"] === "production";

  const cspHeader = isProduction
    ? [
        `script-src 'nonce-${nonce}' 'strict-dynamic' https: http:`,
        `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`,
        // Chrome ignores 'unsafe-inline' on style-src once a nonce is present (it applies to
        // style-src-attr too via fallback), which silently drops every React style={{...}}
        // attribute and framer-motion's runtime style mutations. A separate style-src-attr
        // directive has no nonce of its own, so its 'unsafe-inline' is honored normally.
        `style-src-attr 'unsafe-inline'`,
        `img-src 'self' data: https: http:`,
        `font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:`,
        `connect-src 'self' https://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com`,
        `frame-src 'self'`,
        `object-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `frame-ancestors 'none'`,
        `default-src 'self'`,
        `upgrade-insecure-requests`,
      ].join("; ")
    : [
        `script-src 'unsafe-inline' 'unsafe-eval' https: http: ws:`,
        `style-src 'unsafe-inline' https: http:`,
        `img-src 'self' data: https: http:`,
        `font-src 'self' https: http: data:`,
        `connect-src 'self' https: http: ws: wss:`,
        `frame-src 'self'`,
        `default-src 'self' https: http:`,
      ].join("; ");

  return {
    "Content-Security-Policy": cspHeader,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": isProduction ? "DENY" : "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": isProduction
      ? [
          "camera=()",
          "geolocation=()",
          "gyroscope=()",
          "magnetometer=()",
          "microphone=()",
          "payment=()",
          "usb=()",
        ].join(", ")
      : "",
    ...(isProduction && {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    }),
  };
}
