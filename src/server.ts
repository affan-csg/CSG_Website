import "./lib/error-capture";

import crypto from "crypto";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

declare global {
  var __CSP_NONCE__: string | undefined;
}

import * as serverEntryModule from "@tanstack/react-start/server-entry";

async function getServerEntry(): Promise<ServerEntry> {
  return (serverEntryModule.default ?? serverEntryModule) as ServerEntry;
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

function getSecurityHeaders(nonce: string): Record<string, string> {
  // In development, use permissive CSP to allow Vite HMR and external resources
  // In production, use strict nonce-based CSP
  const isProduction = process.env["NODE_ENV"] === "production";

  const cspHeader = isProduction
    ? [
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

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const nonce = generateNonce();
      // Store nonce in global for access during SSR (src/routes/__root.tsx reads it via globalThis.__CSP_NONCE__)
      globalThis.__CSP_NONCE__ = nonce;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);

      // Clear the global after render to avoid leaking across requests
      globalThis.__CSP_NONCE__ = undefined;
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response);

      // Apply security headers to the response
      const securityHeaders = getSecurityHeaders(nonce);
      const headersToApply = new Headers(normalizedResponse.headers);

      for (const [key, value] of Object.entries(securityHeaders)) {
        headersToApply.set(key, value);
      }

      // Inject nonce meta tag and add nonce attributes to executable script tags for CSP compliance
      let body = await normalizedResponse.clone().text();

      // Add nonce meta tag for client-side access
      if (body.includes("<head>")) {
        body = body.replace("<head>", `<head><meta name="csp-nonce" content="${nonce}" />`);
      }

      // Add nonce attribute to all script tags that don't already have one and aren't JSON-LD data
      body = body.replace(/<script([^>]*)>/g, (match) => {
        // Skip if already has nonce
        if (match.includes("nonce=")) return match;
        // Skip JSON-LD and JSON data scripts
        if (
          match.includes('type="application/ld+json"') ||
          match.includes("type='application/ld+json'") ||
          match.includes('type="application/json"') ||
          match.includes("type='application/json'")
        ) {
          return match;
        }
        // Add nonce to executable scripts
        return match.replace(">", ` nonce="${nonce}">`);
      });

      return new Response(body, {
        status: normalizedResponse.status,
        statusText: normalizedResponse.statusText,
        headers: headersToApply,
      });
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
