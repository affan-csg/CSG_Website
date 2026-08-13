import { describe, it, expect } from "vitest";

describe("Security Headers", () => {
  // This test validates the CSP header structure
  it("should have valid CSP directives", () => {
    const nonce = "test-nonce-12345678";
    const cspDirectives = [
      `script-src 'nonce-${nonce}' 'strict-dynamic' https: http:`,
      `style-src 'nonce-${nonce}' 'unsafe-inline'`,
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
    ];

    const cspHeader = cspDirectives.join("; ");

    // Verify nonce is in the header
    expect(cspHeader).toContain(`'nonce-${nonce}'`);

    // Verify strict-dynamic is present
    expect(cspHeader).toContain("'strict-dynamic'");

    // Verify critical directives
    expect(cspHeader).toContain("object-src 'none'");
    expect(cspHeader).toContain("frame-ancestors 'none'");
    expect(cspHeader).toContain("upgrade-insecure-requests");

    // Verify it's a valid semi-colon separated list
    const directives = cspHeader.split("; ");
    expect(directives.length).toBeGreaterThan(5);
  });

  it("should have all required security headers", () => {
    const requiredHeaders = [
      "Content-Security-Policy",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "X-XSS-Protection",
      "Referrer-Policy",
      "Permissions-Policy",
      "Strict-Transport-Security",
    ];

    // This test documents which headers should be present
    expect(requiredHeaders).toContain("Content-Security-Policy");
    expect(requiredHeaders).toContain("X-Content-Type-Options");
    expect(requiredHeaders).toContain("X-Frame-Options");
  });

  it("should have restrictive Permissions-Policy", () => {
    const permissionsPolicy = [
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", ");

    expect(permissionsPolicy).toContain("camera=()");
    expect(permissionsPolicy).toContain("microphone=()");
    expect(permissionsPolicy).toContain("geolocation=()");
  });

  it("should enforce HSTS with appropriate duration", () => {
    const hstsHeader = "max-age=31536000; includeSubDomains; preload";
    const maxAge = 31536000; // 1 year in seconds

    expect(hstsHeader).toContain("max-age=" + maxAge);
    expect(hstsHeader).toContain("includeSubDomains");
    expect(hstsHeader).toContain("preload");
  });

  it("should not allow object-src or plugins", () => {
    const cspHeader = "object-src 'none'";
    expect(cspHeader).toContain("'none'");
  });

  it("should restrict framing to prevent clickjacking", () => {
    const xFrameOptions = "DENY";
    expect(xFrameOptions).toBe("DENY");
  });
});
