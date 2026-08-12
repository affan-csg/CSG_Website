# Career Source Group — Global Staffing Platform

> Premium staffing and talent delivery platform connecting businesses with expert talent across the US, LATAM (nearshore), and Pakistan (offshore).

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/careersourcegroup/website)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [SEO & Performance](#seo--performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Career Source Group (CSG) is a global staffing company offering:

- **10% Direct-Hire Fee** (vs. industry standard 20-30%)
- **Pod Model** for team-based staffing vs. individual placements
- **Three Regional Services:**
  - 🇺🇸 **US** — Direct hire, contract, contract-to-hire
  - 🇲🇽 **LATAM** — Nearshore contract (30-70% cost savings)
  - 🇵🇰 **Pakistan** — Offshore contract (50-70% cost savings)

**One contract. One invoice. One point of contact.**

---

## ✨ Features

### Core Features
- ✅ **Responsive Design** — Mobile-first, optimized for all devices
- ✅ **Premium Typography** — Manrope font system with clear hierarchy
- ✅ **Dynamic Routing** — File-based routing for staffing specialties and regions
- ✅ **Interactive Forms** — Contact, requirement, and candidate forms
- ✅ **Blog Platform** — CMS-ready blog structure with dynamic routes

### Performance & SEO
- ✅ **Server-Side Rendering (SSR)** — Fast initial page loads, SEO-friendly
- ✅ **JSON-LD Structured Data** — Organization, LocalBusiness, FAQPage, Service, Article, Breadcrumb schemas
- ✅ **Meta Tags & Open Graph** — Per-page titles/descriptions, real canonical tags, optimized for social sharing
- ✅ **Sitemap & Robots.txt** — Search engine discovery, including individual blog posts
- ✅ **Image Optimization** — Lazy loading, responsive images

See [SEO & Performance](#seo--performance) below for what's implemented vs. still open (hreflang is intentionally not enabled yet).

### Visual & Animation
- ✅ **Three.js Particles** — Interactive 3D background effects
- ✅ **Framer Motion** — Smooth page transitions and micro-interactions
- ✅ **GSAP** — Advanced animations and timelines
- ✅ **Lenis** — Premium smooth scroll experience
- ✅ **Custom Cursor** — Branded cursor effects

### Accessibility
- ✅ **WCAG AA Compliant** — Proper contrast ratios, keyboard navigation
- ✅ **Semantic HTML** — Proper heading hierarchy, ARIA labels
- ✅ **Focus Management** — Visible focus states, keyboard support
- ✅ **Color Contrast** — 4.5:1 minimum for body text

---

## 🏗️ Tech Stack

### Frontend Framework
- **[TanStack Start](https://tanstack.com/start)** (1.168.x) — Modern React SSR framework
- **[React](https://react.dev)** (19.2) — UI library
- **[TanStack Router](https://tanstack.com/router)** (1.170) — Type-safe file-based routing

### Styling & Design
- **[Tailwind CSS](https://tailwindcss.com)** (4.2) — Utility-first CSS framework
- **[Manrope Font](https://fonts.google.com/specimen/Manrope)** — Premium typeface (weights: 400-800)
- **[OKLCH Color Space](https://oklch.com/)** — Modern perceptually uniform colors

### Animation & Interactivity
- **[Framer Motion](https://www.framer.com/motion)** (13.0) — React animation library
- **[GSAP](https://gsap.com)** (3.15) — Professional animation platform
- **[Lenis](https://lenis.darkroom.engineering)** (1.3) — Smooth scroll library
- **[Three.js](https://threejs.org)** (0.185) — 3D graphics
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** (9.7) — React renderer for Three.js

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com)** (7.71) — Performant form state
- **[Zod](https://zod.dev)** (3.24) — TypeScript-first validation
- **[Radix UI](https://radix-ui.com)** — Accessible component primitives

### UI Components & Icons
- **[shadcn/ui](https://ui.shadcn.com)** — Copy-paste component library
- **[Lucide React](https://lucide.dev)** — Icon library (575+ icons)
- **[Embla Carousel](https://www.embla-carousel.com)** — Carousel component
- **[React Day Picker](https://react-day-picker.js.org)** — Date picker

### Data & State Management
- **[TanStack React Query](https://tanstack.com/query)** (5.101) — Server state management
- **[Supabase](https://supabase.com)** (`@supabase/supabase-js` 2.112) — Form submission storage + résumé file storage
- **[Recharts](https://recharts.org)** (2.15) — Data visualization

### Build & Deployment
- **[Vite](https://vitejs.dev)** (8.2) — Lightning-fast build tool
- **[Nitro](https://nitro.unjs.io)** (3.0 beta) — Universal server framework
- **[Vercel](https://vercel.com)** — Deployment platform (configured)

### Development Tools
- **[TypeScript](https://www.typescriptlang.org)** (5.8) — Type safety
- **[ESLint](https://eslint.org)** — Code linting
- **[Prettier](https://prettier.io)** — Code formatting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/careersourcegroup/website.git
cd website

# Install dependencies
pnpm install
```

### Development

```bash
# Start dev server with hot reload
pnpm dev

# Dev server runs at http://localhost:5173
```

### Build & Preview

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Linting & Formatting

```bash
# Check for linting errors
pnpm lint

# Format code with Prettier
pnpm format
```

---

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── forms/                 # Form components
│   │   │   ├── contact-form.tsx
│   │   │   ├── requirement-form.tsx
│   │   │   └── bench-form.tsx
│   │   ├── site/                  # Site-specific components
│   │   │   ├── site-nav.tsx       # Navigation
│   │   │   ├── site-footer.tsx    # Footer
│   │   │   ├── hero-particles.tsx # 3D particles
│   │   │   ├── primitives.tsx     # Reusable page primitives
│   │   │   └── ...
│   │   └── ui/                    # shadcn/ui components (50+)
│   │
│   ├── content/                   # Static content & data
│   │   ├── pages.ts               # Page content
│   │   ├── site.ts                # Navigation, FAQs, company info
│   │   ├── staffing.ts            # Staffing role descriptions
│   │   ├── delivery.ts            # Regional delivery info
│   │   ├── pods.ts                # Pod model details
│   │   ├── blog.ts                # Blog posts
│   │   └── legal.ts               # Legal documents (markdown)
│   │
│   ├── lib/                       # Utilities & helpers
│   │   ├── seo.ts                 # SEO helpers (JSON-LD)
│   │   ├── forms.ts               # Form utilities
│   │   ├── utils.ts               # General utilities
│   │   └── ...
│   │
│   ├── routes/                    # File-based routes
│   │   ├── __root.tsx             # Root layout
│   │   ├── index.tsx              # Home page
│   │   ├── our-story.tsx          # Our Story page (incl. Why CSG section)
│   │   ├── staffing.index.tsx     # Staffing hub (parent section)
│   │   ├── staffing.roles.tsx     # Staffing Roles (child)
│   │   ├── staffing.pods.tsx      # Pods (child)
│   │   ├── staffing.specialized-roles.tsx  # Specialized Roles directory (child)
│   │   ├── staffing.$slug.tsx     # Individual specialized role
│   │   ├── global-delivery/
│   │   ├── pods.tsx               # Legacy /pods → 301 redirect to /staffing/pods
│   │   ├── blog/
│   │   ├── contact.tsx            # Contact page
│   │   ├── get-started.tsx        # Requirement form
│   │   ├── join-our-bench.tsx     # Candidate application
│   │   ├── faq.tsx                # FAQ page
│   │   └── ...legal pages
│   │
│   ├── styles.css                 # Global styles & typography
│   ├── start.ts                   # Client entry point
│   ├── server.ts                  # Server entry point
│   └── router.tsx                 # Router configuration
│
├── public/
│   ├── images/
│   │   ├── brand/                 # Logo, icons
│   │   ├── team/                  # Team photos
│   │   ├── blog/                  # Blog images
│   │   └── ...
│   └── favicon.svg
│
├── .vercel/                       # Vercel deployment config
├── .gitignore                     # Git ignore rules
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite + Nitro config
├── package.json                   # Dependencies
├── TYPOGRAPHY.md                  # Typography system guide
└── README.md                      # This file
```

---

## ⚙️ Configuration

### Environment Variables

Copy [`.env.example`](./.env.example) to `.env.local` and fill in the values. The required ones:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase — required. Forms (contact, get-started, join-our-bench) persist here.
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Everything else in `.env.example` (Resend, Turnstile, Calendly, revalidation) is present for future use but not currently wired into the form flow — see [Database](#-database) below.

### 🗄️ Database

All three forms write to Supabase, not email — there's no `mailto:` fallback. See
[`src/lib/form-actions.ts`](./src/lib/form-actions.ts) for the server functions and
[`src/lib/server/`](./src/lib/server/) for the Supabase client, insert logic, rate
limiting, and Zod validation.

| Form | Table | Notes |
| --- | --- | --- |
| Contact (`/contact`) | `contact_submissions` | No rate limit — honeypot only |
| Get a Requirement (`/get-started`) | `client_requirements` | Rate-limited: 5/email/hr, 20/IP/hr |
| Join Our Bench (`/join-our-bench`) | `candidate_applications` | Same rate limits; résumé uploaded to the private `resumes` Storage bucket, referenced by path, never a public URL |

**Setup:** on a fresh Supabase project, run every file in [`supabase/migrations/`](./supabase/migrations/) in order via the SQL Editor (or `supabase db push` if the project is linked with the CLI). On the existing production project, migrations `001`–`005` are already applied — only `006_bench_form_fields.sql` needs to be run (adds `seniority`, `expected_monthly_rate`, `message` to `candidate_applications`).

Row-level security is enabled on all three tables with staff-only `SELECT`; inserts go through the `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS and must never be imported into client-side code — that's why the key is only ever read inside `src/lib/server/supabase-admin.ts`, and why files that touch it live under `src/lib/server/` (a directory the build's import-protection rule blocks from being imported by client bundles).

### Tailwind & Typography

- **Theme Colors:** Navy (0.17 lch), Cream (0.972 lch), Gold (0.79 lch)
- **Font:** Manrope (all weights 400-800)
- **Typography System:** See [TYPOGRAPHY.md](./TYPOGRAPHY.md)

---

## 🔍 SEO & Performance

> **2026-08-12:** Fixed three bugs that were only visible by actually rendering the pages, not by reading the source — all JSON-LD scripts were silently empty (wrong field name), every `/blog/$slug` URL rendered the blog listing instead of the post (missing route nesting fix), and most page titles rendered the brand name twice. Full writeup in [SEO_GUIDE.md](./SEO_GUIDE.md#three-bugs-that-only-showed-up-when-the-pages-were-actually-rendered).

### SEO Features Implemented

#### ✅ Structured Data (JSON-LD)
- Organization + LocalBusiness schema (root layout)
- FAQPage schema, built from the real Q&A content on `/faq`
- Service schema on each of the 8 `/staffing/$slug` specialty pages
- Regional LocalBusiness schema on each `/global-delivery/$region` page
- Article schema on each `/blog/$slug` post
- BreadcrumbList schema on all of the above dynamic pages

#### ✅ Meta Tags
- Page-specific titles and descriptions (unique per route, including per blog post — previously all 6 posts shared identical metadata)
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs — every page emits its own `<link rel="canonical">`. This was previously broken (see [SEO_GUIDE.md](./SEO_GUIDE.md#meta-tags--open-graph)): a hardcoded root-level canonical meant every non-home page declared the homepage as canonical.

#### ⚠️ Geo-Targeting — partially implemented
- **Regional schema markup** — done, see above
- **Hreflang tags** — helper exists (`buildHreflangLinks` in `src/lib/seo.ts`) but is deliberately *not* wired up: the regional pages are English-language content about LATAM/Pakistan, not translations, so tagging them `es-MX`/`en-PK` would be an incorrect signal. Needs real translated pages first.
- **Geo-location metadata** — helper exists (`buildGeoTargetingMeta`) but unused; Google gives it little weight, so it's low priority.

#### ✅ Sitemap & Robots
- **sitemap.xml** — static, includes every real page including individual blog posts; legacy redirect URLs correctly excluded
- **robots.txt** — configured for crawlers
- Legacy URL renames (`/about`, `/services`, `/why-csg`) 301-redirect to their new paths so link equity transfers

#### ✅ Performance
- Server-side rendering (SSR) for fast initial loads
- Lazy loading for images
- Optimized font loading (preconnect)
- Minimal CSS/JS payloads
- Caching headers for assets

### Performance Metrics
Not yet measured against a production deploy of the current build — run Lighthouse/PageSpeed Insights before citing numbers here.

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Deploy with Vercel CLI
vercel

# Or push to GitHub and connect to Vercel dashboard
git push origin main
```

### Other Platforms

This project works on:
- **Netlify** — Configure build command: `pnpm build`
- **Cloudflare Workers** — Use Workers deployment
- **Traditional Node.js Hosting** — Build and run via Node server

### Build Command
```bash
pnpm build
```

### Preview Before Deploy
```bash
pnpm preview
```

---

## 📖 Documentation

- **[TYPOGRAPHY.md](./TYPOGRAPHY.md)** — Complete typography system guide with examples
- **[TYPOGRAPHY_UPGRADE_SUMMARY.md](./TYPOGRAPHY_UPGRADE_SUMMARY.md)** — Typography upgrade details

---

## 🤝 Contributing

This is a proprietary project, but internal contributions follow these guidelines:

1. **Branch Naming:** `feature/feature-name`, `fix/bug-name`, `docs/doc-name`
2. **Commit Messages:** Clear, descriptive, present tense
3. **Code Style:** Run `npm run format` before committing
4. **Testing:** Ensure no lint errors: `npm run lint`
5. **Pull Requests:** Link issues, describe changes, test in staging

---

## 📄 License

© 2024-2026 Career Source Group, LLC. All rights reserved.

This is a proprietary project. Unauthorized use, reproduction, or distribution is prohibited.

---

## 📞 Support & Contact

- **Website:** https://careersourcegroup.com
- **Email:** hello@careersourcegroup.com
- **LinkedIn:** [Career Source Group](https://linkedin.com/company/career-source-group)
- **Phone:** Contact us via website form

---

## 🙏 Acknowledgments

Built with modern web technologies:
- React, TypeScript, Tailwind CSS
- TanStack ecosystem (Start, Router, Query)
- Three.js, GSAP, Framer Motion
- Vercel for hosting and deployment

**Last Updated:** August 2026  
**Current Version:** 2.0 (Typography Upgrade Complete)
