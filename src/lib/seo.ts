/**
 * SEO helper utilities for TanStack Router.
 * Use these in route head() functions for consistent SEO.
 */

const SITE_URL = "https://careersourcegroup.com";
const SITE_NAME = "Career Source Group";
const DEFAULT_OG_IMAGE = "/images/brand/CSG.png";

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noindex?: boolean;
}

export function buildSeoMeta(opts: SeoOptions) {
  const url = SITE_URL + opts.path;
  const image = opts.ogImage || DEFAULT_OG_IMAGE;
  const imageUrl = image.startsWith("http") ? image : SITE_URL + image;

  return [
    { title: opts.title + " | " + SITE_NAME },
    { name: "description", content: opts.description },
    { name: "keywords", content: opts.keywords || "staffing, talent acquisition, US staffing, LATAM nearshore, Pakistan offshore, direct hire, contract staffing, Career Source Group" },
    { name: "author", content: SITE_NAME },
    { name: "robots", content: opts.noindex ? "noindex, nofollow" : "index, follow" },
    { name: "canonical", content: url },
    // Open Graph
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: opts.ogType || "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: imageUrl },
  ];
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Career Source Group, LLC",
    "url": SITE_URL,
    "logo": SITE_URL + DEFAULT_OG_IMAGE,
    "description": "US staffing and talent delivery firm providing direct hire, contract, and contract-to-hire talent across the US, LATAM, and Pakistan.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "6040 Yorkridge Dr",
      "addressLocality": "Alpharetta",
      "addressRegion": "Georgia",
      "postalCode": "30005",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-443-875-9677",
      "contactType": "customer service",
      "availableLanguage": ["English", "Spanish"]
    },
    "sameAs": [
      "https://www.linkedin.com/in/zohaibkhawaja/",
      "https://www.facebook.com/61559974043500",
      "https://www.instagram.com/careersourcegroup"
    ]
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Career Source Group, LLC",
    "url": SITE_URL,
    "logo": SITE_URL + DEFAULT_OG_IMAGE,
    "description": "US staffing and talent delivery firm providing direct hire, contract, and contract-to-hire talent across the US, LATAM, and Pakistan.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "6040 Yorkridge Dr",
      "addressLocality": "Alpharetta",
      "addressRegion": "Georgia",
      "postalCode": "30005",
      "addressCountry": "US"
    },
    "telephone": "+1-443-875-9677",
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-18:00",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.0754,
      "longitude": -84.2941
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "Mexico"
      },
      {
        "@type": "Country",
        "name": "Pakistan"
      }
    ]
  };
}

export function buildFaqJsonLd(questions: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}
