// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper & security headers).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // This project's env vars use the NEXT_PUBLIC_ naming convention (see
    // .env.example) rather than Vite's default VITE_ prefix. Without this,
    // NEXT_PUBLIC_* vars are only visible to server code via real process.env
    // — reading them in shared/client code (e.g. src/content/site.ts) causes
    // an SSR/client hydration mismatch, since the browser bundle has no real
    // process.env. Adding the prefix here makes Vite statically replace
    // `import.meta.env.NEXT_PUBLIC_*` with the same baked-in value on both
    // the server and client bundles.
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  },
});
