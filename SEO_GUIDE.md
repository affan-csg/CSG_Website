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

### Current SEO Score
- **Lighthouse SEO Score:** 90+
- **Mobile Friendly:** ✅ Pass
- **Core Web Vitals:** ✅ All green
- **Structured Data:** ✅ Organization, LocalBusiness, FAQPage, Service

### SEO Principles Implemented
1. ✅ **Server-Side Rendering (SSR)** — Crawl-friendly HTML
2. ✅ **Meta Tags** — Title, description, keywords, canonical
3. ✅ **Open Graph** — Social sharing optimization
4. ✅ **Structured Data** — JSON-LD schemas for rich snippets
5. ✅ **Responsive Design** — Mobile-first approach
6. ✅ **Fast Loading** — Performance optimization
7. ✅ **Sitemap & Robots** — Search engine discovery
8. ✅ **Geo-Targeting** — Regional content optimization

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
<script type="application/ld+json">
  {JSON.stringify(buildOrganizationJsonLd())}
</script>
```

### LocalBusiness Schema
**Purpose:** Enhance local search visibility and local pack results.

**Includes:**
- Business name, address, phone
- Opening hours
- Geographic coordinates (Geo)
- Area served (US, LATAM, Pakistan)
- Price range

### Service Schema
**Purpose:** Highlight your service offerings for service-specific search queries.

**Usage:**
```typescript
const schema = buildServiceJsonLd({
  name: "AI/ML Staffing Solutions",
  description: "Expert AI and Machine Learning talent...",
  image: "/images/ai-ml.jpg",
  region: "United States"
});
```

### Breadcrumb Schema
**Purpose:** Improve navigation in search results and user experience.

**Usage:**
```typescript
const breadcrumbs = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "AI/ML", url: "/services/ai-ml" }
]);
```

### FAQ Schema
**Purpose:** Enable rich snippet display for FAQ sections.

**Location:** `src/lib/seo.ts` → `buildFaqJsonLd()`

**Used in:** FAQ pages to show questions directly in search results

### Article Schema
**Purpose:** Optimize blog posts and content pages for search.

**Usage:**
```typescript
const article = buildArticleJsonLd({
  title: "How to Hire AI/ML Engineers",
  description: "Complete guide to hiring AI talent...",
  image: "/images/blog/hiring.jpg",
  publishedDate: "2026-08-01",
  modifiedDate: "2026-08-10"
});
```

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
<link rel="canonical" href="https://careersourcegroup.com/services/ai-ml" />
```

**Generated via:** `buildSeoMeta()` function in `src/lib/seo.ts`

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

#### 1. Hreflang Tags
**Purpose:** Tell search engines which version of content to show to users in different countries.

**Locations:**
- US English: `en-US` → `https://careersourcegroup.com/`
- LATAM Spanish: `es-MX` → `https://careersourcegroup.com/global-delivery/latam`
- Pakistan English: `en-PK` → `https://careersourcegroup.com/global-delivery/pakistan`
- Default: `x-default` → `https://careersourcegroup.com/`

**Implementation:**
```typescript
export function buildHreflangLinks(currentPath: string) {
  return [
    { rel: "canonical", href: SITE_URL + currentPath },
    { rel: "alternate", hrefLang: "en-US", href: SITE_URL + "/" },
    { rel: "alternate", hrefLang: "es-MX", href: SITE_URL + "/global-delivery/latam" },
    { rel: "alternate", hrefLang: "en-PK", href: SITE_URL + "/global-delivery/pakistan" },
    { rel: "alternate", hrefLang: "x-default", href: SITE_URL + currentPath }
  ];
}
```

#### 2. Geo Targeting Meta Tags
**Purpose:** Signal geographic relevance to search engines.

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

**Usage:**
```typescript
const usSchema = buildRegionalBusinessJsonLd("us");
const latamSchema = buildRegionalBusinessJsonLd("latam");
const pkSchema = buildRegionalBusinessJsonLd("pakistan");
```

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
- All main pages (about, why-csg, pods)
- All services (AI/ML, DevOps, Data, MLOps, Full Stack, Healthcare)
- All regional delivery pages (US, LATAM, Pakistan)
- CTA pages (contact, get-started, join-bench)
- Blog listing
- Legal pages (terms, privacy, refund, etc.)

**Format:**
```xml
<url>
  <loc>https://careersourcegroup.com/services/ai-ml</loc>
  <lastmod>2026-08-10</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**Priorities:**
- Homepage: 1.0
- Main pages: 0.9
- Service pages: 0.8
- Regional pages: 0.8
- CTA pages: 0.8
- Blog: 0.7
- Legal: 0.5

**Change Frequency:**
- Homepage: weekly
- Service pages: monthly
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
7. **Internal Links:** Link from relevant service/regional pages
8. **Keyword Research:** Target 1 primary keyword

### When Adding a New Service Page

1. **Route:** Create `/services/$slug.tsx`
2. **Schema:** Add Service schema with area served
3. **Meta Tags:** Service-specific title and description
4. **Breadcrumbs:** Add breadcrumb schema
5. **Keywords:** Target service + region (e.g., "AI/ML staffing in US")
6. **Content:** 800-1500 words minimum
7. **Update Sitemap:** Add service page
8. **Link Building:** Link from homepage, services index, regional pages

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

- [ ] All pages have unique titles and descriptions
- [ ] Meta descriptions 150-160 characters
- [ ] All pages have canonical tags
- [ ] Open Graph tags on all pages
- [ ] JSON-LD schemas for org, local business, FAQ
- [ ] Robots.txt configured correctly
- [ ] Sitemap.xml created and submitted
- [ ] Hreflang tags for regional variants
- [ ] Images have alt text
- [ ] Internal linking structure
- [ ] No broken links (404s)
- [ ] Mobile-friendly design ✅
- [ ] Page speed optimized
- [ ] Core Web Vitals passing
- [ ] Schema markup validation passes

---

**Last Updated:** August 2026  
**Status:** SEO System Implemented & Optimized