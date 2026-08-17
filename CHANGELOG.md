# Changelog

All notable changes to the Career Source Group website.

## [Unreleased] - 2026-08-14 (SEO/GEO/AEO/Performance audit + critical CSP nonce fix)

### Added

- `public/llms.txt` — plain-language site summary for LLM-based answer engines (ChatGPT, Claude, Perplexity, etc.), following the [llms.txt](https://llmstxt.org) convention: company facts (address, hours, regions served, fee model) plus a linked directory of every real page
- `public/robots.txt` — explicit `Allow: /` entries for AI/answer-engine crawlers (`GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`, `Claude-Web`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`) plus a pointer comment to `llms.txt` — these were already reachable under the wildcard `Allow: /`, but explicit rules make the intent unambiguous to crawlers/auditors and guard against future rule changes accidentally blocking them
- `loading="lazy" decoding="async"` on every below-the-fold `<img>` (homepage secondary sections, `/our-story` founder/team photos, blog card thumbnails, footer logo, `LogoWall` client logos) so they no longer compete with the hero image for bandwidth on initial load
- `fetchPriority="high"` on the homepage hero logo (the actual LCP element) to signal the browser to fetch it first
- `src/lib/theme-colors.ts` — new canonical `PARTICLE_HEX` / `PARTICLE_RGB` constants for particle/trail colors (restored to original golden `#c8ab6e` while text remains electric blue `#659ef7`)

### Fixed

- **CRITICAL: CSP nonce was never reaching rendered `<script>` tags, which would block all JavaScript in production CSP-enforcing browsers.** The nonce was generated in `src/server.ts` during the SSR request, but injected into HTML *after* render completed via a meta tag and string manipulation. SSR-rendered scripts never got the nonce attribute, so under the production CSP's `'nonce-...' 'strict-dynamic'`, all scripts (including the app's own hydration bundle) would be CSP-violating. Fixed by: (1) setting the nonce in `globalThis.__CSP_NONCE__` before render, (2) reading it in `src/lib/get-nonce.ts` during SSR, and (3) post-rendering, adding `nonce="..."` attributes to all executable script tags (except JSON-LD data scripts). Verified live: the nonce is now present on 3/5 script tags (the 2 JSON-LD exceptions correctly excluded), and the hydration bundle is now CSP-compliant.
- **The 4 homepage feature images (`who-we-are`, `staffing`, `how-pod-models-work`, `how-we-differ`) were uncompressed PNGs averaging ~2MB each — ~8MB of images loading on the homepage alone.** Re-encoded all 4 as WebP (quality 80) via `sharp`: 1778KB→92KB, 2106KB→154KB, 1914KB→121KB, 2054KB→144KB (92.7-94.8% smaller, ~511KB combined). This was by far the largest concrete performance issue found — at ~8MB it would fail Core Web Vitals (LCP/page-weight) on any real device, especially mobile. Old PNGs deleted, all references in `src/routes/index.tsx` updated to the `.webp` paths.
- `src/lib/accessibility-utilities.ts:debounceAnimationFrame` — had a no-op `if (checkReducedMotion())` branch where both branches executed identical code (`return requestAnimationFrame(callback)`). Removed the dead conditional and simplified to just `return requestAnimationFrame(callback)`.
- `src/lib/performance-monitor.ts:collectCoreWebVitals` — created 4 new `PerformanceObserver` instances per call and never called `.disconnect()` on them, causing a memory leak on remount (React StrictMode double-invoke, HMR). Each observer now disconnects after its first callback fires.
- **Duplicated region dataset in `src/lib/seo.ts`.** `buildRegionalBusinessJsonLd` and `buildGeoTargetingMeta` independently defined the same per-region `{ us, latam, pakistan }` lookup with identical coordinates. Consolidated to a single `REGION_INFO` constant exported from `seo.ts` and consumed by both functions.
- **Removed dead code:** deleted `src/lib/initialize-monitoring.ts`, `src/lib/error-tracking.ts`, `src/lib/types/index.ts`, `src/hooks/use-reduced-motion.ts`, and their tests — all were unreachable or unused exports that cluttered the codebase without any active wiring.
- Particle and custom-cursor colors restored to golden (`#c8ab6e` / `rgb(200, 171, 110)`) for visual continuity, while text/UI remain electric blue. Particles now reference `PARTICLE_HEX` / `PARTICLE_RGB` instead of the accent color constants.

### Verified

- SEO audit: `buildSeoMeta`/JSON-LD coverage confirmed present and correct on every real route (Organization + LocalBusiness on root, Service + Breadcrumb on `/staffing/$slug`, Regional LocalBusiness + Breadcrumb on `/global-delivery/$region`, FAQPage on `/faq`, Article + Breadcrumb on `/blog/$slug`); `sitemap.xml`'s 34 URLs cross-checked 1:1 against actual routes (legacy redirect routes correctly excluded); canonical/OG/Twitter meta present on every page
- GEO audit: regional `LocalBusiness` JSON-LD (with real `GeoCoordinates` + `areaServed`) confirmed wired on all 3 `/global-delivery/$region` pages; `buildHreflangLinks`/`buildGeoTargetingMeta` confirmed still intentionally unused per the existing README note (regional pages are English content, not translations — tagging them `es-MX`/`en-PK` would be an incorrect signal; geo meta tags carry little ranking weight per Google's own guidance) — no change needed there
- **CSP nonce fix verified live:** ran the built Vercel function against production CSP headers; confirmed 3 of 5 rendered script tags now carry `nonce="..."` attributes matching the CSP header's nonce (the 2 JSON-LD data scripts are correctly excluded), and the hydration bundle `<script type="module" src="...">` is now CSP-compliant
- Re-ran `tsc --noEmit` (0 errors), `pnpm lint` (0 errors, 16 pre-existing `react-refresh` warnings), full test suite (141/141 passing after removing dead test files), and `pnpm build` (0 errors) after all fixes above
- Smoke-tested the rebuilt Vercel serverless function: `/`, `/blog` render 200 with WebP images, golden particles, electric-blue text, and CSP-compliant scripts; particle colors confirmed restored to golden while UI text remains electric blue

- Real client logo images (Synovus, Deloitte, BCBS, M3, TK Elevators) in the "Who We've Delivered For" section on `/our-story`, replacing plain text — `LogoWall` component (`src/components/site/primitives.tsx`) renders each on a white chip with a name label underneath, files under `public/images/brand/`

### Changed

- `--gold` design token (`src/styles.css`) changed from the original pale tan (`oklch(0.79 0.082 85)`) to a steel/electric blue (`oklch(0.7 0.145 259)`, same value as `--electric`) — this is an intentional, confirmed design decision (not a bug), and it propagates automatically to every accent use site-wide via the CSS variable (buttons, links, borders, focus rings, chart colors) since `--accent`, `--ring`, `--chart-1`, etc. all reference `var(--gold)`. The token is still named `--gold` for now; a follow-up rename to something like `--accent`/`--primary-accent` would remove the naming mismatch but was out of scope here.
- Went through every place gold was hardcoded **outside** the CSS variable (these do NOT auto-update from a token change, so they needed manual edits) and switched them to the matching electric-blue value:
  - `src/components/site/hero-canvas.tsx` — particle field color `#c8ab6e` → `#659ef7`
  - `src/components/site/custom-cursor.tsx` — cursor trail particle color `rgba(200,171,110,*)` → `rgba(101,158,247,*)`
  - `src/routes/index.tsx`, `src/components/site/site-nav.tsx`, `src/components/site/site-footer.tsx` — the CSG logo's tint (`filter: invert()/sepia()/hue-rotate()` chain applied to the orange source PNG at `public/images/brand/CSG.png`) was re-solved via an empirical coordinate-descent color match (see `## Filter re-solve method` below) against the new target color instead of the old gold; base filter is now `invert(100%) sepia(33%) saturate(130%) hue-rotate(41deg) brightness(105%)`, hover variant (index.tsx hero logo only) is `invert(75%) sepia(48%) saturate(308%) hue-rotate(62deg) brightness(134%)`
  - `public/favicon.svg` — "CSG" text fill `#c8ab6e` → `#659ef7`
  - `src/routes/index.tsx` hero logo drop-shadow glow `rgba(200,171,110,*)` → `rgba(101,158,247,*)`
  - `#659ef7` is the sRGB hex equivalent of `oklch(0.7 0.145 259)` (computed via the standard OKLab→linear-sRGB matrix, not eyeballed)
  - Added `src/lib/theme-colors.ts` (`ACCENT_HEX`, `ACCENT_RGB`) as the single canonical source for this hex value in JS/canvas contexts, and pointed `hero-canvas.tsx` and `custom-cursor.tsx` at it instead of inline literals — those two were free to centralize since they're plain JS. The 3 logo-filter locations and `favicon.svg` **cannot** import it (Tailwind arbitrary-value classes must be statically analyzable at build time; favicon.svg is a static file outside the JS build), so they stay as hardcoded literals by necessity — `theme-colors.ts`'s docstring is the pointer to keep them in sync by hand
  - **If `--gold`/`--electric` is ever changed again**: update `theme-colors.ts` first, then grep for `c8ab6e`/`659ef7`/`200, 171, 110`/`101, 158, 247` to catch the remaining hardcoded spots (now just the 3 logo filters + favicon + drop-shadow, down from 5)
- `src/components/site/floating-consult-cta.tsx` — the floating "Schedule a Consultation" button (bottom-right, appears after scrolling past the hero) was `bg-gold` by default; changed to match the "Submit a Requirement" button styling (`bg-cream` default / `hover:bg-gold`) per explicit request — it should not default to the accent color
- Navbar CSG logo (`src/components/site/site-nav.tsx`) now shows immediately on page load on every route except the homepage; the homepage keeps its scroll-triggered fade-in so it doesn't duplicate the large centered hero logo
- Removed duplicated "Synovus. Deloitte. BCBS. M3. TK Elevators..." sentence that appeared as plain text in both the "Why CSG" list and the "Who We've Delivered For" body — the logo wall (with name labels) is now the single place those names appear (`src/content/pages.ts`)

### Filter re-solve method

The CSG logo tint was originally produced by hand-tuning a CSS `filter` chain (invert/sepia/saturate/hue-rotate/brightness) against the orange source PNG until it visually looked gold — the classic "recolor a raster image via filter" hack (same idea as the well-known "black to any color" filter generators). There's no closed-form way to invert that by hand for a new target color, so it was re-solved programmatically: a headless-Chromium script (Playwright) drew the real logo PNG to a `<canvas>` with a candidate filter string via `ctx.filter`, sampled the average RGB of opaque pixels, and ran coordinate descent over the 5 filter parameters to minimize distance to the target RGB (`#659ef7`). Converged to within ~11/255 per-channel distance (visually indistinguishable). Verified against a rendered screenshot before applying to the actual components. This approach (not manual guessing) should be reused if the accent color changes again.

### Fixed

- Site-wide particle background (`src/components/animation/lazy-hero-canvas.tsx`) could be delayed indefinitely or never render — it was gated behind an unbounded `requestIdleCallback` with no timeout, so a page with sustained background activity could starve it forever. Added a 2s bounded timeout so it reliably mounts.
- Cleared all 54 pre-existing `tsc --noEmit` errors across 13 files (`server.ts`, `error-tracking.ts`, `analytics-integration.ts`, `initialize-monitoring.ts`, `performance-monitor.ts`, both `error-boundary` files, all 3 `animation/lazy-*`/`reveal-with-motion` files, `seo.test.ts`, `error-capture.test.ts`) — mostly `noPropertyAccessFromIndexSignature`/`exactOptionalPropertyTypes`/`noUncheckedIndexedAccess` strictness gaps, plus a couple of unsafe `window`/`JSX.IntrinsicElements` casts replaced with properly typed ones. `tsc --noEmit` now exits clean.
- Fixed a test-isolation bug in `use-reduced-motion.test.ts`: an earlier test's `window.matchMedia` mock leaked into a later test (no restore in between), making it assert against `undefined` instead of the real query string
- Restored `public/favicon.ico`, which had been deleted outside of any tracked change during this session

### Verified

- Clean `tsc --noEmit` (0 errors), `pnpm lint` (0 errors), `pnpm build` (Vercel Nitro preset, 0 errors), and full test suite (161/161 passing)
- Smoke-tested the actual built Vercel serverless function (`.vercel/output/functions/__server.func/index.mjs`) directly — `/`, `/our-story`, `/global-delivery/latam`, `/staffing/ai-ml`, `/contact` all return 200 with correct titles and the production strict CSP header; an unknown route correctly returns 404

## [Unreleased] - 2026-08-13

### Fixed

- Normalized 70 files from CRLF to LF line endings that were silently inflating `pnpm lint` to 20+ minutes (thousands of spurious `Delete '␍'` errors from `eslint-plugin-prettier`)
- Added `.gitattributes` (`* text=auto eol=lf`) so line endings stay consistent on checkout regardless of a contributor's local `core.autocrlf` setting — without this, the CRLF issue above would silently recur
- Excluded generated/tooling directories (`.vercel`, `.tanstack`, `.wrangler`, `.lovable`, `playwright-report`, `test-results`, `supabase`) from ESLint's file walk in `eslint.config.js` — ESLint 9's flat config lints dotfiles/dotdirs by default, so these were being needlessly scanned

### Verified

- Clean `pnpm build` (client + SSR + Nitro, 0 errors) and `pnpm lint` (0 errors, 7 pre-existing `react-refresh` warnings) after the fixes above

## [2.0.0] - 2026-08-12

### Added

- Route restructure: `/our-story`, `/staffing`, `/staffing/roles`, `/staffing/pods`, `/staffing/specialized-roles`, `/staffing/$slug`; legacy `/about`, `/services`, `/services/$slug`, `/why-csg`, `/pods` now serve 301 redirects to their replacements
- Supabase-backed form persistence for contact, get-started, and join-our-bench forms, with server-side Zod validation and per-email/per-IP rate limiting (`src/lib/form-actions.ts`, `src/lib/server/`)
- Résumé upload to a private Supabase Storage bucket, referenced by path only (never a public URL)
- Six SQL migrations under `supabase/migrations/` (schema, indexes, rate limiting, contact submissions, specialty slugs, bench form fields)
- Full Playwright e2e suite: contact, requirement, bench-form, regional-delivery, and staffing-navigation specs

### Fixed

- JSON-LD structured data was silently empty on every page due to a wrong field name
- Every `/blog/$slug` URL rendered the blog listing instead of the individual post (missing route nesting)
- Most page titles rendered the brand name twice
- Canonical URLs previously all pointed to the homepage regardless of the actual page

### Removed

- Bun tooling (`bun.lock`, `bunfig.toml`) — project is pnpm-only going forward

## [1.1.0] - 2026-08-10

### Added

- Premium Manrope typography system (20+ responsive utilities)
- Six new SEO schema utilities (Service, Breadcrumb, Regional LocalBusiness, Article, AggregateRating) plus geo-targeting/hreflang helpers (written but deliberately not wired up — regional pages are English content, not translations)
- `public/robots.txt`, `public/sitemap.xml`, `public/.well-known/security.txt`

## [1.0.1] - 2026-08-08

### Fixed

- Production SSR server entry import
- Vite config targeting the Vercel Nitro build

## [1.0.0] - 2024-08-07

### Added

- Complete website redesign with modern UI/UX
- Three.js animated particles on hero sections
- Responsive mobile navbar with scroll support
- SEO optimization with JSON-LD structured data
- Geo/local SEO for Alpharetta, GA location
- Sitemap.xml and robots.txt
- Golden SVG favicon
- Custom cursor effects
- Smooth scroll animations
- Image hover effects and transitions

### Improved

- Reduced content for better UX (60% less text)
- Alternating image/text layouts on home page
- Consistent image sizing with aspect-[4/3]
- Mobile responsiveness across all pages
- Floating CTA hidden on mobile to avoid duplication
- Navbar logo scroll animation

### Fixed

- Duplicate image removal from sections
- Ring visibility on global delivery sub-pages
- Mobile navbar scrolling when dropdowns open
- Import conflicts in index.tsx

## [0.1.0] - Initial Setup

- Project initialization with TanStack Start
- Basic routing and page structure
- Initial content and styling
