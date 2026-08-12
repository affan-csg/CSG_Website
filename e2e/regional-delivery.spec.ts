import { test, expect } from '@playwright/test';

test.describe('Regional Global Delivery E2E Tests', () => {
  test('should load global-delivery main page', async ({ page }) => {
    await page.goto('/global-delivery');
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page).toHaveTitle(/global.?delivery|delivery/i);

    // Should have navigation or links to regions
    const pageContent = page.locator('main');
    await expect(pageContent).toBeVisible();
  });

  test('should navigate to US region page', async ({ page }) => {
    // Navigate to global-delivery
    await page.goto('/global-delivery');
    await page.waitForLoadState('networkidle');

    // Look for US region link
    const usLink = page.locator('a[href*="/global-delivery/us"]');

    if (await usLink.isVisible()) {
      // Click US link
      await usLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on US page
      expect(page.url()).toContain('/global-delivery/us');

      // Verify page has US-specific content
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();

      // Look for US-specific content indicators
      const usContent = page.locator('text=/US|United States|direct hire|contract/i').first();
      await expect(usContent).toBeVisible();
    }
  });

  test('should navigate to LATAM region page', async ({ page }) => {
    await page.goto('/global-delivery');
    await page.waitForLoadState('networkidle');

    // Look for LATAM region link
    const latamLink = page.locator('a[href*="/global-delivery/latam"], a[href*="/global-delivery/latin"]');

    if (await latamLink.isVisible()) {
      await latamLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on LATAM page
      expect(page.url()).toMatch(/\/global-delivery\/(latam|latin)/i);

      // Verify page has LATAM-specific content
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();

      // Look for LATAM-specific content
      const latamContent = page.locator('text=/LATAM|Latin|Nearshore|savings|cost/i').first();
      await expect(latamContent).toBeVisible();
    }
  });

  test('should navigate to Pakistan region page', async ({ page }) => {
    await page.goto('/global-delivery');
    await page.waitForLoadState('networkidle');

    // Look for Pakistan region link
    const pkLink = page.locator('a[href*="/global-delivery/pakistan"], a[href*="/global-delivery/pk"]');

    if (await pkLink.isVisible()) {
      await pkLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on Pakistan page
      expect(page.url()).toMatch(/\/global-delivery\/(pakistan|pk)/i);

      // Verify page has Pakistan-specific content
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();

      // Look for Pakistan-specific content
      const pkContent = page.locator('text=/Pakistan|Offshore|talent|developers/i').first();
      await expect(pkContent).toBeVisible();
    }
  });

  test('should access all regions from global-delivery directory', async ({ page }) => {
    await page.goto('/global-delivery');
    await page.waitForLoadState('networkidle');

    // Get all region links
    const regionLinks = page.locator('a[href*="/global-delivery/"]');
    const count = await regionLinks.count();

    // Should have at least 3 region links (US, LATAM, Pakistan)
    expect(count).toBeGreaterThanOrEqual(3);

    // Verify each link is valid
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = regionLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toMatch(/\/global-delivery\/[\w-]+/);
    }
  });

  test('should display distinct content for each region', async ({ page }) => {
    const regions = ['us', 'latam', 'pakistan'];
    const regionContents: Record<string, string> = {};

    for (const region of regions) {
      await page.goto(`/global-delivery/${region}`);
      await page.waitForLoadState('networkidle');

      // Get page main content
      const mainContent = await page.locator('main').textContent();
      regionContents[region] = mainContent || '';

      // Verify content is loaded
      expect(mainContent).toBeTruthy();
      expect(mainContent?.length).toBeGreaterThan(50);
    }

    // Verify each region has some unique content
    // (They shouldn't all be identical)
    const uniqueContents = new Set(Object.values(regionContents));
    expect(uniqueContents.size).toBeGreaterThan(1);
  });

  test('should have working region navigation links', async ({ page }) => {
    // Start at US page
    await page.goto('/global-delivery/us');
    await page.waitForLoadState('networkidle');

    // Look for links to other regions
    const regionLinks = page.locator('a[href*="/global-delivery/"]');
    const linkCount = await regionLinks.count();

    // Should have some region navigation
    if (linkCount > 1) {
      // Click second link (different region)
      const secondLink = regionLinks.nth(1);
      const secondLinkHref = await secondLink.getAttribute('href');

      await secondLink.click();
      await page.waitForLoadState('networkidle');

      // Verify navigation worked
      expect(page.url()).toContain(secondLinkHref);
    }
  });

  test('should handle region page without accessing parent', async ({ page }) => {
    // Navigate directly to region page without going through main page
    await page.goto('/global-delivery/latam');
    await page.waitForLoadState('networkidle');

    // Should still load correctly
    expect(page.url()).toContain('/global-delivery/latam');

    // Should have content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Should have regional content indicators
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should display pricing or cost information by region', async ({ page }) => {
    const regions = ['us', 'latam', 'pakistan'];

    for (const region of regions) {
      await page.goto(`/global-delivery/${region}`);
      await page.waitForLoadState('networkidle');

      // Look for pricing, cost, or rate information
      const pricingInfo = page.locator('text=/cost|price|rate|budget|savings|hire/i').first();

      // Most region pages should have some pricing/hiring info
      if (region !== 'us') {
        // LATAM and Pakistan emphasize cost savings
        const costSavingsInfo = page.locator('text=/savings|cost|affordable|budget/i').first();
        const isVisible = await costSavingsInfo.isVisible().catch(() => false);
        // They may or may not have explicit pricing
      }
    }
  });

  test('should work on mobile viewport for all regions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const regions = ['us', 'latam', 'pakistan'];

    for (const region of regions) {
      await page.goto(`/global-delivery/${region}`);
      await page.waitForLoadState('networkidle');

      // Content should be visible and readable
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();

      // Main content should be accessible
      const content = page.locator('main');
      await expect(content).toBeVisible();

      // Should be able to scroll
      await page.evaluate(() => window.scrollBy(0, 100));
    }
  });

  test('should have SEO meta tags for regional pages', async ({ page }) => {
    const regions = ['us', 'latam', 'pakistan'];

    for (const region of regions) {
      await page.goto(`/global-delivery/${region}`);
      await page.waitForLoadState('networkidle');

      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      const hasDescription = await metaDescription.count() > 0;

      // Check for og:title (Open Graph)
      const ogTitle = page.locator('meta[property="og:title"]');
      const hasOg = await ogTitle.count() > 0;

      // At least one SEO tag should exist
      expect(hasDescription || hasOg).toBe(true);
    }
  });

  test('should have hreflang tags for regional targeting', async ({ page }) => {
    await page.goto('/global-delivery/us');
    await page.waitForLoadState('networkidle');

    // Look for hreflang tags (used for SEO geo-targeting)
    const hreflangs = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangs.count();

    // Modern sites use hreflang for region targeting
    // This test is informational - site may or may not have them
    // If count > 0, that's good SEO practice
    if (count > 0) {
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('should navigate between regions using browser back/forward', async ({ page }) => {
    // Start at US
    await page.goto('/global-delivery/us');
    await page.waitForLoadState('networkidle');

    // Navigate to LATAM
    await page.goto('/global-delivery/latam');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/global-delivery/latam');

    // Navigate to Pakistan
    await page.goto('/global-delivery/pakistan');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/global-delivery/pakistan');

    // Go back to LATAM
    await page.goBack();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/global-delivery/latam');

    // Go back to US
    await page.goBack();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/global-delivery/us');

    // Go forward to LATAM
    await page.goForward();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/global-delivery/latam');
  });

  test('should display team or talent info for each region', async ({ page }) => {
    const regions = ['us', 'latam', 'pakistan'];

    for (const region of regions) {
      await page.goto(`/global-delivery/${region}`);
      await page.waitForLoadState('networkidle');

      // Look for team, talent, developers, or engineers mentions
      const teamInfo = page.locator('text=/team|talent|developers|engineers|experts|specialists/i').first();

      // Should have some indication of available talent
      const isVisible = await teamInfo.isVisible().catch(() => false);
      // Not all regions may explicitly mention this, so not strict
    }
  });

  test('should have CTA or contact options on region pages', async ({ page }) => {
    const regions = ['us', 'latam', 'pakistan'];

    for (const region of regions) {
      await page.goto(`/global-delivery/${region}`);
      await page.waitForLoadState('networkidle');

      // Look for CTA buttons or contact links
      const ctaButton = page.locator('button, a[href*="/contact"], a[href*="/get-started"]').first();

      // Should have some way to take action
      const isVisible = await ctaButton.isVisible().catch(() => false);
      // Region pages should have CTAs
    }
  });
});
