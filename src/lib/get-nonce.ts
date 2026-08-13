import { useEffect, useState } from "react";

export function getNonce(): string | undefined {
  // First, try to get from meta tag (SSR + client)
  if (typeof document !== "undefined") {
    const meta = document.querySelector('meta[name="csp-nonce"]');
    if (meta) {
      return meta.getAttribute("content") ?? undefined;
    }
  }

  // Fallback for server context (will be undefined during SSR head() call)
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
