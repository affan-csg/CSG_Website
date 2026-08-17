import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getSecurityHeaders } from "./security-headers";

describe("Security Headers", () => {
  const nonce = "test-nonce-12345678";
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    originalNodeEnv = process.env["NODE_ENV"];
  });

  afterEach(() => {
    process.env["NODE_ENV"] = originalNodeEnv;
  });

  describe("production", () => {
    beforeEach(() => {
      process.env["NODE_ENV"] = "production";
    });

    it("should have valid CSP directives", () => {
      const cspHeader = getSecurityHeaders(nonce)["Content-Security-Policy"];

      expect(cspHeader).toContain(`'nonce-${nonce}'`);
      expect(cspHeader).toContain("'strict-dynamic'");
      expect(cspHeader).toContain("object-src 'none'");
      expect(cspHeader).toContain("frame-ancestors 'none'");
      expect(cspHeader).toContain("upgrade-insecure-requests");

      const directives = cspHeader?.split("; ") ?? [];
      expect(directives.length).toBeGreaterThan(5);
    });

    it("should allow same-origin stylesheets so the built CSS actually loads", () => {
      const cspHeader = getSecurityHeaders(nonce)["Content-Security-Policy"] ?? "";
      const styleSrc = cspHeader.split("; ").find((d) => d.startsWith("style-src"));

      expect(styleSrc).toContain("'self'");
      expect(styleSrc).toContain("https://fonts.googleapis.com");
    });

    it("should allow inline style attributes despite the style-src nonce", () => {
      // Chrome ignores 'unsafe-inline' in style-src once a nonce is present, which
      // otherwise silently breaks every React style={{...}} attribute and framer-motion's
      // runtime style mutations. A separate nonce-less style-src-attr directive is required.
      const cspHeader = getSecurityHeaders(nonce)["Content-Security-Policy"] ?? "";
      const directives = cspHeader.split("; ");
      const styleSrcAttr = directives.find((d) => d.startsWith("style-src-attr"));

      expect(styleSrcAttr).toBe("style-src-attr 'unsafe-inline'");
    });

    it("should have all required security headers", () => {
      const headers = getSecurityHeaders(nonce);

      expect(headers).toHaveProperty("Content-Security-Policy");
      expect(headers).toHaveProperty("X-Content-Type-Options", "nosniff");
      expect(headers).toHaveProperty("X-Frame-Options", "DENY");
      expect(headers).toHaveProperty("X-XSS-Protection");
      expect(headers).toHaveProperty("Referrer-Policy");
      expect(headers).toHaveProperty("Permissions-Policy");
      expect(headers).toHaveProperty("Strict-Transport-Security");
    });

    it("should have restrictive Permissions-Policy", () => {
      const permissionsPolicy = getSecurityHeaders(nonce)["Permissions-Policy"];

      expect(permissionsPolicy).toContain("camera=()");
      expect(permissionsPolicy).toContain("microphone=()");
      expect(permissionsPolicy).toContain("geolocation=()");
    });

    it("should enforce HSTS with a one-year max-age", () => {
      const hsts = getSecurityHeaders(nonce)["Strict-Transport-Security"];

      expect(hsts).toContain("max-age=31536000");
      expect(hsts).toContain("includeSubDomains");
      expect(hsts).toContain("preload");
    });
  });

  describe("development", () => {
    beforeEach(() => {
      process.env["NODE_ENV"] = "development";
    });

    it("should not set HSTS", () => {
      expect(getSecurityHeaders(nonce)).not.toHaveProperty("Strict-Transport-Security");
    });

    it("should allow Vite HMR websocket connections", () => {
      const cspHeader = getSecurityHeaders(nonce)["Content-Security-Policy"] ?? "";
      expect(cspHeader).toContain("ws:");
    });
  });
});
