import "./lib/error-capture";

import crypto from "crypto";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

import * as serverEntryModule from "@tanstack/react-start/server-entry";

async function getServerEntry(): Promise<ServerEntry> {
  return (serverEntryModule.default ?? serverEntryModule) as ServerEntry;
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

function getSecurityHeaders(nonce: string): Record<string, string> {
  const cspHeader = [
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
  ].join("; ");

  return {
    "Content-Security-Policy": cspHeader,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": [
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
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

      // Store nonce in a request-scoped way (via a custom header)
      // Clone request headers to avoid mutation issues in dev server
      const headers = new Headers();
      for (const [key, value] of request.headers) {
        headers.set(key, value);
      }
      headers.set("x-csp-nonce", nonce);

      const modifiedRequest = new Request(request, { headers });

      const handler = await getServerEntry();
      const response = await handler.fetch(modifiedRequest, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response);

      // Apply security headers to the response
      const securityHeaders = getSecurityHeaders(nonce);
      const headersToApply = new Headers(normalizedResponse.headers);

      for (const [key, value] of Object.entries(securityHeaders)) {
        headersToApply.set(key, value);
      }

      // Inject nonce as a meta tag comment for React to pick up
      // This is a workaround since we can't directly pass context through the Request
      let body = await normalizedResponse.clone().text();
      if (body.includes("<head>")) {
        body = body.replace("<head>", `<head><meta name="csp-nonce" content="${nonce}" />`);
      }

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
