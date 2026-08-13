# Changelog

All notable changes to the Career Source Group website.

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
