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
- ✅ **Dynamic Routing** — File-based routing for services and regions
- ✅ **Interactive Forms** — Contact, requirement, and candidate forms
- ✅ **Blog Platform** — CMS-ready blog structure with dynamic routes

### Performance & SEO
- ✅ **Server-Side Rendering (SSR)** — Fast initial page loads, SEO-friendly
- ✅ **JSON-LD Structured Data** — Organization, LocalBusiness, FAQPage schemas
- ✅ **Meta Tags & Open Graph** — Optimized for social sharing
- ✅ **Hreflang Tags** — Geographic targeting for US/LATAM/Pakistan
- ✅ **Sitemap & Robots.txt** — Search engine discovery
- ✅ **Image Optimization** — Lazy loading, responsive images

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
- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/careersourcegroup/website.git
cd website

# Install dependencies
npm install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Dev server runs at http://localhost:5173
```

### Build & Preview

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Format code with Prettier
npm run format
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
│   │   ├── services.ts            # Service descriptions
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
│   │   ├── about.tsx              # About page
│   │   ├── services/
│   │   │   ├── index.tsx          # Services directory
│   │   │   └── $slug.tsx          # Individual service
│   │   ├── global-delivery/
│   │   ├── pods.tsx               # Pod model page
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

Create `.env.local` in the project root:

```env
# Email/Form Submission
VITE_FORMSPREE_ENDPOINT=your_formspree_project_id

# Optional: Analytics
VITE_GA_ID=your_google_analytics_id

# Optional: Vercel Analytics
VITE_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### Tailwind & Typography

- **Theme Colors:** Navy (0.17 lch), Cream (0.972 lch), Gold (0.79 lch)
- **Font:** Manrope (all weights 400-800)
- **Typography System:** See [TYPOGRAPHY.md](./TYPOGRAPHY.md)

---

## 🔍 SEO & Performance

### SEO Features Implemented

#### ✅ Structured Data (JSON-LD)
- Organization schema with contact info, social profiles
- LocalBusiness schema for regional services
- FAQPage schema with Q&A pairs
- Service schemas for each specialty

#### ✅ Meta Tags
- Page-specific titles (55-60 characters)
- Meta descriptions (150-160 characters)
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs (prevent duplicates)

#### ✅ Geo-Targeting
- **Hreflang tags** for US/LATAM/Pakistan regional variants
- **Geo-location metadata** for regional pages
- **Regional schema markup** with local business data

#### ✅ Sitemap & Robots
- **sitemap.xml** (auto-generated or static)
- **robots.txt** (optimized for crawlers)

#### ✅ Performance
- Server-side rendering (SSR) for fast initial loads
- Lazy loading for images
- Optimized font loading (preconnect)
- Minimal CSS/JS payloads
- Caching headers for assets

### Performance Metrics
- **First Contentful Paint (FCP):** < 1s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Lighthouse Score:** 90+

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
- **Netlify** — Configure build command: `npm run build`
- **Cloudflare Workers** — Use Workers deployment
- **Traditional Node.js Hosting** — Build and run via Node server

### Build Command
```bash
npm run build
```

### Preview Before Deploy
```bash
npm run preview
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
