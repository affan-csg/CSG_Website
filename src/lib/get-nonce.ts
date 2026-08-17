import { useEffect, useState } from "react";

// Server-side only: injected by src/server.ts at request time
let serverNonce: string | undefined;

export function setServerNonce(nonce: string): void {
  serverNonce = nonce;
}

export function getNonce(): string | undefined {
  // During SSR, return the server-side nonce if available
  if (typeof document === "undefined") {
    return serverNonce;
  }

  // On the client, fetch from the meta tag (set by server.ts's html injection)
  const meta = document.querySelector('meta[name="csp-nonce"]');
  if (meta) {
    return meta.getAttribute("content") ?? undefined;
  }

  return undefined;
}

export function useNonce(): string | undefined {
  const [nonce, setNonce] = useState<string | undefined>(undefined);

  useEffect(() => {
    const meta = document.querySelector('meta[name="csp-nonce"]');
    if (meta) {
      setNonce(meta.getAttribute("content") ?? undefined);
    }
  }, []);

  // Return immediately if in SSR context
  if (typeof document === "undefined") {
    return undefined;
  }

  return nonce || getNonce();
}
