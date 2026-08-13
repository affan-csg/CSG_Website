# SEO & Geo-Targeting Guide — Career Source Group

Complete guide to SEO implementation, geo-targeting, and search engine optimization for the CSG website.

---

## 📋 Table of Contents

1. [SEO Overview](#seo-overview)
2. [Structured Data (JSON-LD)](#structured-data-json-ld)
3. [Meta Tags & Open Graph](#meta-tags--open-graph)
4. [Geo-Targeting Strategy](#geo-targeting-strategy)
5. [Sitemap & Robots.txt](#sitemap--robotstxt)
6. [Regional Optimization](#regional-optimization)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🎯 SEO Overview

### Current State (verified 2026-08-12 against a running dev server, not just read from source)

- **Structured Data:** Organization, LocalBusiness, FAQPage, Service, Article, Regional LocalBusiness, BreadcrumbList — all wired to real pages (see [Structured Data](#structured-data-json-ld))
- **Canonical tags:** Fixed — every page now emits its own `<link rel="canonical">`. Previously every page silently canonicalized to the homepage (see [Meta Tags & Open Graph](#meta-tags--open-graph)); this was a real duplicate-content bug, not a style nit.
- **Lighthouse score / Core Web Vitals:** Not yet measured against the current build — don't cite a number until someone actually runs Lighthouse against a production deploy.

### Three bugs that only showed up when the pages were actually rendered

Everything above was verified by booting the dev server and reading the real HTML output, not just the source. That's how these were caught — none were visible from reading `seo.ts` in isolation:

1. **No JSON-LD had ever rendered, anywhere, ever.** `buildOrganizationJsonLd()` etc. were correctly built and correctly passed into `head().scripts`, but every script entry used the key `JSON: JSON.stringify(...)`. TanStack Router's script-tag renderer looks for a `children` key, not `JSON` — so `JSON` silently became an unused custom HTML attribute and every `<script type="application/ld+json">` shipped completely empty. This affected the Organization/LocalBusiness schema in `__root.tsx` too, meaning **zero structured data was ever live on the site**, regardless of what this doc claimed. Fixed by renaming the field to `children` everywhere (`src/routes/__root.tsx`, `blog.$slug.tsx`, `staffing.$slug.tsx`, `global-delivery.$region.tsx`, `faq.tsx`).
2. **Every blog post URL rendered the blog listing page, not the post.** `src/routes/blog.tsx` had no `<Outlet />`, but TanStack Router's file-based routing convention made it the _parent_ of `blog.$slug.tsx` purely because of the filename prefix (`blog.tsx` + `blog.$slug.tsx` = parent/child, the same way `services.$slug.tsx` would nest under a plain `services.tsx`). Without an Outlet, the child route's component never mounts — visiting any `/blog/$slug` URL silently rendered `BlogPage` (the listing) instead of `BlogPostPage`. All 6 posts were unreadable at their own URLs. Fixed by renaming `blog.tsx` → `blog.index.tsx` (matching the `.index.tsx` convention already used correctly for `staffing`/`global-delivery`/`services`), which makes it a sibling instead of a parent.
3. **Most page titles rendered with the brand name twice**, e.g. `"Contact Us | Career Source Group | Career Source Group"`. 15 routes hardcoded `" | Career Source Group"` in their own `title`, on top of `buildSeoMeta()` unconditionally appending the same suffix. Fixed by stripping the hardcoded suffix from every route (and from the three region titles in `src/content/delivery.ts`), and adding an opt-out (`titleSuffix: false`) for the homepage, which intentionally leads with the brand name instead of trailing it.

**Takeaway for future SEO work on this repo:** verify against rendered HTML (`curl` the dev server, grep for the actual tags), not just against the source code. All three of these looked completely correct from the source alone.

### SEO Principles Implemented

1. ✅ **Server-Side Rendering (SSR)** — Crawl-friendly HTML
2. ✅ **Meta Tags** — Title, description, keywords, canonical (per-page, see fix note above)
3. ✅ **Open Graph** — Social sharing optimization
4. ✅ **Structured Data** — JSON-LD schemas for rich snippets, wired into the pages that have matching content
5. ✅ **Responsive Design** — Mobile-first approach
6. ⚠️ **Fast Loading** — No performance budget or measurement in place yet; see [Performance Optimization](#performance-optimization)
7. ✅ **Sitemap & Robots** — Search engine discovery
8. ⚠️ **Geo-Targeting** — Helpers exist (`buildRegionalBusinessJsonLd`, wired) but hreflang/geo-meta are intentionally NOT wired — see [Geo-Targeting Strategy](#geo-targeting-strategy) for why

---

## 🏗️ Structured Data (JSON-LD)

### Organization Schema

**Purpose:** Tells search engines who you are, where you are, and how to contact you.

**Location:** `src/lib/seo.ts` → `buildOrganizationJsonLd()`

**Includes:**

- Company name, URL, logo
- Physical address
- Contact point (phone, email)
- Service areas
- Social profiles (LinkedIn, Facebook, Instagram)

**Rendered in:** Root layout (`src/routes/__root.tsx`)

```jsx
<script type="application/ld+json">{JSON.stringify(buildOrganizationJsonLd())}</script>
```

### LocalBusiness Schema

**Purpose:** Enhance local search visibility and local pack results.

**Includes:**

- Business name, address, phone
- Opening hours
- Geographic coordinates (Geo)
- Area served (US, LATAM, Pakistan)
- Price range

### Staffing Schema

**Purpose:** Highlight your staffing offerings for staffing-specific search queries.

**Wired in:** `src/routes/staffing.$slug.tsx` — each of the 8 specialty pages (`/staffing/ai-ml`, `/staffing/mlops`, etc.) emits its own schema.org `Service` object (built via `buildStaffingJsonLd()`) from that page's loader data.

### Breadcrumb Schema

**Purpose:** Improve navigation in search results and user experience.

**Wired in:** `src/routes/staffing.$slug.tsx`, `src/routes/global-delivery.$region.tsx`, and `src/routes/blog.$slug.tsx` — each dynamic detail page emits a `Home → Section → Page` breadcrumb trail matching its actual nav hierarchy.

### FAQ Schema

**Purpose:** Enable rich snippet display for FAQ sections.

**Location:** `src/lib/seo.ts` → `buildFaqJsonLd()`

**Wired in:** `src/routes/faq.tsx`, built from the real `faqs` array in `src/content/site.ts` (both client and talent questions).

### Article Schema

**Purpose:** Optimize blog posts and content pages for search.

**Wired in:** `src/routes/blog.$slug.tsx` — each post gets its own title, description (the post's own opening paragraph), and `datePublished` instead of the previous shared generic "Blog Post" metadata that was identical across all 6 posts.

---

## 📝 Meta Tags & Open Graph

### Title Tag

**Format:** `Page Title | Career Source Group`

**Examples:**

- `AI/ML Staffing Solutions | Career Source Group` (60 chars)
- `Why Choose Career Source Group? | CSG` (55 chars)
- `Global Staffing - US, LATAM & Pakistan | CSG` (50 chars)

**Best Practices:**

- Keep under 60 characters (60-70 recommended)
- Front-load important keywords
- Include brand name at end
- Make it compelling (CTR optimization)

### Meta Description

**Format:** Clear, compelling description with keyword.

**Guidelines:**

- 150-160 characters
- Include primary keyword naturally
- Include call-to-action if applicable
- Different for each page (no duplicates)

**Example:**
"Hire AI/ML engineers with 10% direct-hire fee. Access talent across US, LATAM (30-70% savings), and Pakistan (50-70% savings)."

### Canonical Tags

**Purpose:** Prevent duplicate content issues.

**Implementation:**

```jsx
<link rel="canonical" href="https://careersourcegroup.com/staffing/ai-ml" />
```

**Generated via:** `buildSeoMeta()` function in `src/lib/seo.ts`, returned as a proper `links` entry that each route spreads into its own `head()`.

**Fixed bug:** `buildSeoMeta()` used to emit `<meta name="canonical">`, which browsers and crawlers don't recognize as a canonical signal at all — combined with a single hardcoded `<link rel="canonical" href="https://careersourcegroup.com">` in `__root.tsx`, every page on the site was actually declaring the **homepage** as its canonical URL. That's a real signal to Google to drop non-home pages from the index in favor of `/`. Both are fixed: `buildSeoMeta()` now returns a real `link rel="canonical"` per page, and the hardcoded root-level one was removed.

### Open Graph Tags

**Purpose:** Optimize social sharing (LinkedIn, Facebook, Twitter)

**Implemented Tags:**

- `og:title` — Page title
- `og:description` — Meta description
- `og:image` — Sharing image (1200x630px recommended)
- `og:url` — Canonical URL
- `og:type` — Content type (website, article, etc.)
- `og:site_name` — Site name
- `og:locale` — Language/locale

### Twitter Card

**Purpose:** Optimize Twitter sharing with rich cards

**Implemented:**

- `twitter:card` — `summary_large_image`
- `twitter:title` — Page title
- `twitter:description` — Meta description
- `twitter:image` — Sharing image

---

## 🌍 Geo-Targeting Strategy

### Purpose

Ensure your content appears in relevant geographic regions and target local users more effectively.

### Implementation

#### 1. Hreflang Tags — ⚠️ NOT currently wired up (intentionally)

**Purpose:** Tell search engines which version of content to show to users who search in a different language.

**Why this isn't turned on:** `buildHreflangLinks()` exists in `src/lib/seo.ts` but is not called from any route, and it shouldn't be until the underlying content problem is fixed. Hreflang is for actual language/regional _translations_ of the same page — but `/global-delivery/latam` and `/global-delivery/pakistan` are English-language pages _about_ those regions, not Spanish or Urdu translations. Wiring the helper as currently written would tag `/global-delivery/latam` as `es-MX` (Spanish-Mexico) content when the page is in English, and Pakistan has no meaningful ISO language code as `en-PK` for this purpose. That's a false signal to Google, and Search Console will flag it as a "no return tag" / language-mismatch error. Before wiring this up, either translate the regional pages for real, or drop the hreflang approach and rely on the (correct) per-page canonical tags alone.

**Existing helper (needs the content fix above before use):**

```typescript
export function buildHreflangLinks(currentPath: string) {
  return [
    { rel: "canonical", href: SITE_URL + currentPath },
    { rel: "alternate", hrefLang: "en-US", href: SITE_URL + "/" },
    { rel: "alternate", hrefLang: "es-MX", href: SITE_URL + "/global-delivery/latam" },
    { rel: "alternate", hrefLang: "en-PK", href: SITE_URL + "/global-delivery/pakistan" },
    { rel: "alternate", hrefLang: "x-default", href: SITE_URL + currentPath },
  ];
}
```

#### 2. Geo Targeting Meta Tags — ⚠️ NOT currently wired up

**Purpose:** Signal geographic relevance to search engines. Note Google itself has said `geo.*` meta tags carry little to no ranking weight; the `buildRegionalBusinessJsonLd()` schema (wired, see below) is the signal actually worth prioritizing. Wire this up only if a specific need shows up (e.g. a directory or Bing-specific requirement).

**Meta Tags:**

```html
<meta name="geo.position" content="34.0754, -84.2941" />
<meta name="geo.placename" content="Alpharetta, Georgia, United States" />
<meta name="geo.region" content="geo.us" />
```

**Usage:**

```typescript
const geoMeta = buildGeoTargetingMeta("us");
// For LATAM: buildGeoTargetingMeta("latam")
// For Pakistan: buildGeoTargetingMeta("pakistan")
```

#### 3. Regional Schema Markup

**Purpose:** Provide region-specific structured data.

**Wired in:** `src/routes/global-delivery.$region.tsx` — each of `/global-delivery/us`, `/global-delivery/latam`, and `/global-delivery/pakistan` emits its own `LocalBusiness` schema plus a breadcrumb trail.

**Included Data:**

- Regional business name
- Area served (specific countries)
- Geographic coordinates
- Regional description

#### 4. Regional Content

**Pages:**

- `/global-delivery/us` — US staffing details
- `/global-delivery/latam` — LATAM nearshore details
- `/global-delivery/pakistan` — Pakistan offshore details

**Content Should Include:**

- Region-specific benefits
- Regional cost comparisons
- Local expertise/testimonials
- Regional hiring process
- Time zone & communication info

---

## 🗺️ Sitemap & Robots.txt

### Sitemap.xml

**Location:** `public/sitemap.xml`

**Purpose:** Tell search engines all pages on your site.

**Current Coverage:**

- Homepage
- All main pages (our-story, staffing)
- The Staffing hub (`/staffing`) and its three children: `/staffing/roles`, `/staffing/pods`, `/staffing/specialized-roles`
- All 8 specialized role detail pages (ai-ml, mlops, data, devops, devsecops, cloud, software-dev, product)
- All regional delivery pages (US, LATAM, Pakistan)
- CTA pages (contact, get-started, join-bench)
- Blog listing plus all 6 individual post URLs (`/blog/$slug`) — previously only the listing page was in the sitemap
- Legal pages (terms, privacy, refund, etc.)

**Not in the sitemap (correctly excluded):** the legacy `/about`, `/why-csg`, `/services`, `/services/$slug`, `/pods` URLs — these are 301 redirect stubs (see below), not content, so they should never appear in the sitemap.

### Legacy URL Redirects

The site was renamed (`/about` → `/our-story`, `/services` → `/staffing`, `/why-csg` → `/our-story#why-csg`, `/pods` → `/staffing/pods`). The redirect stubs at the old paths (`src/routes/about.tsx`, `src/routes/why-csg.tsx`, `src/routes/services.index.tsx`, `src/routes/services.$slug.tsx`, `src/routes/pods.tsx`) now explicitly return `statusCode: 301`. TanStack Router's `redirect()` defaults to a `307` (temporary) if you don't set this — for a permanent rename that matters: a 307 tells Google "this might move back, don't consolidate rankings," while a 301 tells it to transfer link equity and index entries to the new URL. Any future URL rename should follow the same pattern.

**Format:**

```xml
<url>
  <loc>https://careersourcegroup.com/staffing/ai-ml</loc>
  <lastmod>2026-08-10</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**Priorities:**

- Homepage: 1.0
- Main pages: 0.9
- Staffing pages: 0.8
- Regional pages: 0.8
- CTA pages: 0.8
- Blog: 0.7
- Legal: 0.5

**Change Frequency:**

- Homepage: weekly
- Staffing pages: monthly
- Blog: weekly
- Legal: yearly

### Robots.txt

**Location:** `public/robots.txt`

**Purpose:** Control which URLs search engines can crawl.

**Current Rules:**

- Allow all public pages
- Block admin, API, and private routes
- Block Vercel build artifacts
- Allow crawl delay of 1 second
- Block known bad bots (Ahrefs, Semrush, MJ12bot)
- Allow social media crawlers (Facebook, Twitter, WhatsApp, LinkedIn)

**Submitted Sitemaps:**

```
Sitemap: https://careersourcegroup.com/sitemap.xml
```

---

## 🌏 Regional Optimization

### US-Focused Strategy

**Keywords:** "US staffing", "direct hire", "contract staffing", "contract-to-hire"

**Meta Title Example:**
"US Staffing & Talent Acquisition | Direct Hire at 10% | CSG"

**Content Focus:**

- Direct hire benefits
- US employment laws compliance
- US timezone availability
- Quick turnaround

### LATAM-Focused Strategy

**Keywords:** "LATAM staffing", "nearshore", "Latin America talent", "cost savings"

**Meta Title Example:**
"LATAM Nearshore Staffing | 30-70% Cost Savings | CSG"

**Content Focus:**

- Cost savings
- Timezone overlap with US
- Cultural alignment
- Quality of talent

### Pakistan-Focused Strategy

**Keywords:** "Pakistan offshore", "offshore staffing", "cost-effective talent"

**Meta Title Example:**
"Pakistan Offshore Staffing | 50-70% Cost Savings | CSG"

**Content Focus:**

- Maximum cost savings
- 24/7 support availability
- Timezone advantage
- Technical expertise

---

## ⚡ Performance Optimization

### Page Speed

- **Target LCP:** < 2.5s
- **Target FCP:** < 1s
- **Target CLS:** < 0.1

### Optimization Techniques

1. **Server-Side Rendering** — Render HTML server-side
2. **Font Loading** — Optimized Google Fonts with preconnect
3. **Image Optimization** — Lazy loading, responsive images
4. **Code Splitting** — Route-based code splitting
5. **Caching** — Browser and server caching headers
6. **Compression** — Gzip/Brotli compression

### Core Web Vitals

- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ Cumulative Layout Shift (CLS) < 0.1
- ✅ First Input Delay (FID) < 100ms

---

## 📊 Monitoring & Maintenance

### Tools to Use

1. **Google Search Console** — Monitor impressions, clicks, CTR
2. **Google Analytics 4** — Track user behavior, conversions
3. **Lighthouse** — Regular performance audits
4. **PageSpeed Insights** — Mobile vs desktop performance
5. **Bing Webmaster Tools** — Monitor Bing crawling
6. **SEMrush/Ahrefs** — Competitor analysis, keyword tracking

### Monthly Checklist

- [ ] Check Search Console for crawl errors
- [ ] Review keyword rankings
- [ ] Check for new backlink opportunities
- [ ] Audit top-performing pages
- [ ] Update outdated content
- [ ] Check for broken links
- [ ] Monitor Core Web Vitals

### Quarterly Tasks

- [ ] Comprehensive SEO audit
- [ ] Review and update sitemaps
- [ ] Check all hreflang implementations
- [ ] Audit metadata across all pages
- [ ] Review regional content performance
- [ ] Update blog content strategy

### Annual Tasks

- [ ] Full website SEO audit
- [ ] Competitive analysis
- [ ] Keyword strategy review
- [ ] Link profile analysis
- [ ] Content strategy refresh

---

## 📈 Adding New Content

### When Adding a New Blog Post

1. **File:** Create in appropriate blog section
2. **Front Matter:** Include date, title, description
3. **Schema:** Add Article schema with metadata
4. **Meta Tags:** Set unique title and description
5. **Open Graph:** Add image and social meta
6. **Update Sitemap:** Add to sitemap.xml
7. **Internal Links:** Link from relevant staffing/regional pages
8. **Keyword Research:** Target 1 primary keyword

### When Adding a New Staffing Page

1. **Route:** Create `/staffing/$slug.tsx`
2. **Schema:** Add Service schema (via `buildStaffingJsonLd()`) with area served
3. **Meta Tags:** Staffing-specific title and description
4. **Breadcrumbs:** Add breadcrumb schema
5. **Keywords:** Target staffing role + region (e.g., "AI/ML staffing in US")
6. **Content:** 800-1500 words minimum
7. **Update Sitemap:** Add staffing page
8. **Link Building:** Link from homepage, staffing index, regional pages

### When Adding Regional Content

1. **Route:** Update regional delivery page
2. **Hreflang:** Update hreflang tags
3. **Geo Meta:** Add region-specific geo tags
4. **Schema:** Use `buildRegionalBusinessJsonLd()`
5. **Keywords:** Include region + service keywords
6. **Content:** Local specificity and relevance
7. **Testimonials:** Add region-specific testimonials

---

## 🔗 Useful Links

- **Search Console:** https://search.google.com/search-console
- **Google Analytics:** https://analytics.google.com
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **Schema.org:** https://schema.org
- **Hreflang Generator:** https://www.aleyda.com/tools/hreflang-generator/
- **Robots.txt Tester:** https://support.google.com/webmasters/answer/6062598

---

## ✅ SEO Checklist Before Launch

- [x] All pages have unique titles and descriptions
- [x] All pages have real `<link rel="canonical">` tags (fixed 2026-08-12 — see [Canonical Tags](#meta-tags--open-graph))
- [x] Open Graph tags on all pages
- [x] JSON-LD schemas for org, local business, FAQ, service, article, breadcrumb — wired into matching pages
- [x] Robots.txt configured correctly
- [x] Sitemap.xml includes every real page, including individual blog posts
- [x] Legacy URL redirects use 301 (permanent), not the router's default 307
- [ ] Meta descriptions verified at 150-160 characters — not yet audited page by page
- [ ] Hreflang tags for regional variants — intentionally not wired, see [Hreflang Tags](#geo-targeting-strategy) for why
- [ ] Images have alt text — not yet audited
- [ ] No broken links (404s) — not yet audited
- [ ] Page speed / Core Web Vitals measured against production — not yet run
- [ ] Schema markup validated with Google's Rich Results Test — not yet run

---

**Last Updated:** 2026-08-12
**Status:** Canonical-tag bug fixed, structured data wired into real pages, sitemap and redirects corrected. Performance and content-quality items above are still open.
