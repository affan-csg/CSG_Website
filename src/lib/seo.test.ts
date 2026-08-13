import { describe, it, expect } from 'vitest';
import {
  buildSeoMeta,
  buildOrganizationJsonLd,
  buildLocalBusinessJsonLd,
  buildFaqJsonLd,
  buildStaffingJsonLd,
  buildBreadcrumbJsonLd,
  buildRegionalBusinessJsonLd,
  buildArticleJsonLd,
  buildAggregateRatingJsonLd,
  buildGeoTargetingMeta,
  buildHreflangLinks,
} from './seo';

const SITE_URL = 'https://careersourcegroup.com';
const SITE_NAME = 'Career Source Group';

describe('buildSeoMeta', () => {
  it('should build SEO meta with title suffix', () => {
    const result = buildSeoMeta({
      title: 'Staffing Solutions',
      description: 'Professional staffing services',
      path: '/staffing',
    });

    expect(result.meta[0]).toEqual({ title: 'Staffing Solutions | Career Source Group' });
  });

  it('should build SEO meta without title suffix when specified', () => {
    const result = buildSeoMeta({
      title: 'Career Source Group',
      description: 'Professional staffing services',
      path: '/',
      titleSuffix: false,
    });

    expect(result.meta[0]).toEqual({ title: 'Career Source Group' });
  });

  it('should include description meta tag', () => {
    const result = buildSeoMeta({
      title: 'Test',
      description: 'Test description',
      path: '/test',
    });

    const descriptionMeta = result.meta.find((m) => m.name === 'description');
    expect(descriptionMeta).toEqual({ name: 'description', content: 'Test description' });
  });

  it('should include Open Graph meta tags', () => {
    const result = buildSeoMeta({
      title: 'Test Page',
      description: 'Test description',
      path: '/test',
    });

    const ogTitle = result.meta.find((m) => m.property === 'og:title');
    const ogDesc = result.meta.find((m) => m.property === 'og:description');
    const ogUrl = result.meta.find((m) => m.property === 'og:url');

    expect(ogTitle).toEqual({ property: 'og:title', content: 'Test Page' });
    expect(ogDesc).toEqual({ property: 'og:description', content: 'Test description' });
    expect(ogUrl).toEqual({ property: 'og:url', content: SITE_URL + '/test' });
  });

  it('should include canonical link', () => {
    const result = buildSeoMeta({
      title: 'Test',
      description: 'Test',
      path: '/test',
    });

    expect(result.links[0]).toEqual({ rel: 'canonical', href: SITE_URL + '/test' });
  });

  it('should use custom OG image URL when provided', () => {
    const result = buildSeoMeta({
      title: 'Test',
      description: 'Test',
      path: '/test',
      ogImage: 'https://example.com/image.png',
    });

    const ogImage = result.meta.find((m) => m.property === 'og:image');
    expect(ogImage).toEqual({
      property: 'og:image',
      content: 'https://example.com/image.png',
    });
  });

  it('should prepend site URL to relative OG images', () => {
    const result = buildSeoMeta({
      title: 'Test',
      description: 'Test',
      path: '/test',
      ogImage: '/images/og.png',
    });

    const ogImage = result.meta.find((m) => m.property === 'og:image');
    expect(ogImage?.content).toBe(SITE_URL + '/images/og.png');
  });

  it('should include robots noindex when specified', () => {
    const result = buildSeoMeta({
      title: 'Test',
      description: 'Test',
      path: '/test',
      noindex: true,
    });

    const robots = result.meta.find((m) => m.name === 'robots');
    expect(robots).toEqual({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  });

  it('should include robots index by default', () => {
    const result = buildSeoMeta({
      title: 'Test',
      description: 'Test',
      path: '/test',
    });

    const robots = result.meta.find((m) => m.name === 'robots');
    expect(robots).toEqual({
      name: 'robots',
      content: 'index, follow',
    });
  });
});

describe('buildOrganizationJsonLd', () => {
  it('should build organization JSON-LD', () => {
    const result = buildOrganizationJsonLd();

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Organization');
    expect(result.name).toBe('Career Source Group, LLC');
    expect(result.url).toBe(SITE_URL);
  });

  it('should include contact point information', () => {
    const result = buildOrganizationJsonLd();

    expect(result.contactPoint).toBeDefined();
    expect(result.contactPoint['@type']).toBe('ContactPoint');
    expect(result.contactPoint.telephone).toBe('+1-443-875-9677');
  });

  it('should include social media links', () => {
    const result = buildOrganizationJsonLd();

    expect(Array.isArray(result.sameAs)).toBe(true);
    expect(result.sameAs.length).toBeGreaterThan(0);
  });
});

describe('buildLocalBusinessJsonLd', () => {
  it('should build local business JSON-LD', () => {
    const result = buildLocalBusinessJsonLd();

    expect(result['@type']).toBe('LocalBusiness');
    expect(result.name).toBe('Career Source Group, LLC');
    expect(result.address).toBeDefined();
  });

  it('should include address information', () => {
    const result = buildLocalBusinessJsonLd();

    expect(result.address.streetAddress).toBe('6040 Yorkridge Dr');
    expect(result.address.addressLocality).toBe('Alpharetta');
    expect(result.address.addressRegion).toBe('Georgia');
  });

  it('should include geo coordinates', () => {
    const result = buildLocalBusinessJsonLd();

    expect(result.geo).toBeDefined();
    expect(result.geo.latitude).toBeCloseTo(34.0754, 3);
    expect(result.geo.longitude).toBeCloseTo(-84.2941, 3);
  });

  it('should include area served', () => {
    const result = buildLocalBusinessJsonLd();

    expect(Array.isArray(result.areaServed)).toBe(true);
    expect(result.areaServed.length).toBeGreaterThan(0);
  });
});

describe('buildFaqJsonLd', () => {
  it('should build FAQ JSON-LD with questions', () => {
    const questions = [
      { question: 'What is staffing?', answer: 'Staffing is hiring talent.' },
      { question: 'How much does it cost?', answer: 'Pricing varies by role.' },
    ];

    const result = buildFaqJsonLd(questions);

    expect(result['@type']).toBe('FAQPage');
    expect(Array.isArray(result.mainEntity)).toBe(true);
    expect(result.mainEntity).toHaveLength(2);
  });

  it('should structure questions correctly', () => {
    const questions = [{ question: 'Test?', answer: 'Yes' }];
    const result = buildFaqJsonLd(questions);

    const firstQuestion = result.mainEntity[0];
    expect(firstQuestion['@type']).toBe('Question');
    expect(firstQuestion.name).toBe('Test?');
    expect(firstQuestion.acceptedAnswer).toBeDefined();
    expect(firstQuestion.acceptedAnswer.text).toBe('Yes');
  });

  it('should handle empty questions array', () => {
    const result = buildFaqJsonLd([]);

    expect(result.mainEntity).toHaveLength(0);
  });
});

describe('buildStaffingJsonLd', () => {
  it('should build staffing service JSON-LD', () => {
    const role = {
      name: 'AI/ML Engineer',
      description: 'We provide top AI/ML talent',
    };

    const result = buildStaffingJsonLd(role);

    expect(result['@type']).toBe('Service');
    expect(result.name).toBe('AI/ML Engineer');
    expect(result.provider['@type']).toBe('Organization');
  });

  it('should include regional information', () => {
    const role = {
      name: 'Test',
      description: 'Test',
      region: 'LATAM',
    };

    const result = buildStaffingJsonLd(role);
    expect(result.areaServed).toBe('LATAM');
  });

  it('should default to United States region', () => {
    const role = {
      name: 'Test',
      description: 'Test',
    };

    const result = buildStaffingJsonLd(role);
    expect(result.areaServed).toBe('United States');
  });
});

describe('buildBreadcrumbJsonLd', () => {
  it('should build breadcrumb JSON-LD', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Staffing', url: '/services/staffing' },
    ];

    const result = buildBreadcrumbJsonLd(items);

    expect(result['@type']).toBe('BreadcrumbList');
    expect(Array.isArray(result.itemListElement)).toBe(true);
    expect(result.itemListElement).toHaveLength(3);
  });

  it('should include correct position and URLs', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
    ];

    const result = buildBreadcrumbJsonLd(items);
    const firstItem = result.itemListElement[0];

    expect(firstItem.position).toBe(1);
    expect(firstItem.name).toBe('Home');
    expect(firstItem.item).toBe(SITE_URL + '/');
  });
});

describe('buildRegionalBusinessJsonLd', () => {
  it('should build US regional business JSON-LD', () => {
    const result = buildRegionalBusinessJsonLd('us');

    expect(result.name).toContain('United States');
    expect(result['@type']).toBe('LocalBusiness');
    expect(result.areaServed).toBeDefined();
  });

  it('should build LATAM regional business JSON-LD', () => {
    const result = buildRegionalBusinessJsonLd('latam');

    expect(result.name).toContain('LATAM');
    expect(result.description).toContain('Nearshore');
  });

  it('should build Pakistan regional business JSON-LD', () => {
    const result = buildRegionalBusinessJsonLd('pakistan');

    expect(result.name).toContain('Pakistan');
    expect(result.description).toContain('Offshore');
  });

  it('should include correct geo coordinates for each region', () => {
    const us = buildRegionalBusinessJsonLd('us');
    const latam = buildRegionalBusinessJsonLd('latam');
    const pakistan = buildRegionalBusinessJsonLd('pakistan');

    expect(us.geo.latitude).toBeCloseTo(34.0754, 3);
    expect(latam.geo.latitude).toBeCloseTo(23.6345, 3);
    expect(pakistan.geo.latitude).toBeCloseTo(30.3753, 3);
  });
});

describe('buildArticleJsonLd', () => {
  it('should build article JSON-LD', () => {
    const article = {
      title: 'Test Article',
      description: 'Test description',
    };

    const result = buildArticleJsonLd(article);

    expect(result['@type']).toBe('Article');
    expect(result.headline).toBe('Test Article');
    expect(result.description).toBe('Test description');
  });

  it('should include optional publication dates', () => {
    const article = {
      title: 'Test',
      description: 'Test',
      publishedDate: '2024-01-01',
      modifiedDate: '2024-01-02',
    };

    const result = buildArticleJsonLd(article);

    expect(result.datePublished).toBe('2024-01-01');
    expect(result.dateModified).toBe('2024-01-02');
  });

  it('should use default author when not provided', () => {
    const article = {
      title: 'Test',
      description: 'Test',
    };

    const result = buildArticleJsonLd(article);

    expect(result.author.name).toBe('Career Source Group, LLC');
  });
});

describe('buildAggregateRatingJsonLd', () => {
  it('should build aggregate rating JSON-LD', () => {
    const result = buildAggregateRatingJsonLd(4.5, 100);

    expect(result['@type']).toBe('AggregateRating');
    expect(result.ratingValue).toBe(4.5);
    expect(result.reviewCount).toBe(100);
  });

  it('should use default best and worst ratings', () => {
    const result = buildAggregateRatingJsonLd(4, 50);

    expect(result.bestRating).toBe(5);
    expect(result.worstRating).toBe(1);
  });

  it('should use custom best and worst ratings', () => {
    const result = buildAggregateRatingJsonLd(8, 50, 10, 0);

    expect(result.bestRating).toBe(10);
    expect(result.worstRating).toBe(0);
  });
});

describe('buildGeoTargetingMeta', () => {
  it('should build US geo targeting meta', () => {
    const result = buildGeoTargetingMeta('us');

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('geo.position');
    expect(result[2].name).toBe('geo.region');
  });

  it('should build LATAM geo targeting meta', () => {
    const result = buildGeoTargetingMeta('latam');

    const region = result.find((m) => m.name === 'geo.region');
    expect(region?.content).toBe('geo.latam');
  });

  it('should build Pakistan geo targeting meta', () => {
    const result = buildGeoTargetingMeta('pakistan');

    const region = result.find((m) => m.name === 'geo.region');
    expect(region?.content).toBe('geo.pakistan');
  });
});

describe('buildHreflangLinks', () => {
  it('should build hrefLang links for current path', () => {
    const result = buildHreflangLinks('/services');

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include canonical link', () => {
    const result = buildHreflangLinks('/services');

    const canonical = result.find((l) => l.rel === 'canonical');
    expect(canonical?.href).toBe(SITE_URL + '/services');
  });

  it('should include alternate hrefLang links', () => {
    const result = buildHreflangLinks('/services');

    const alternates = result.filter((l) => l.rel === 'alternate');
    expect(alternates.length).toBeGreaterThan(0);
  });

  it('should include all language variants', () => {
    const result = buildHreflangLinks('/services');

    const langs = result.map((l) => l.hrefLang || l.rel).filter((v) => v);
    expect(langs).toContain('en-US');
  });
});
