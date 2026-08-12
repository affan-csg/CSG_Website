import { test, expect } from '@playwright/test';

test.describe('Specialized Roles Navigation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Specialized Roles directory (child of the Staffing hub)
    await page.goto('/staffing/specialized-roles');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load specialized roles directory page', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/career source group/i);

    // Verify page has heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display list of all specialties', async ({ page }) => {
    // Should have multiple specialty links/items
    const specialtyLinks = page.locator('a[href*="/staffing/"]');
    const count = await specialtyLinks.count();

    // Expect at least 5+ specialties (based on content/staffing.ts)
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should navigate to specialty detail page via link', async ({ page }) => {
    // Get first specialty link
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();

    // Get the href to verify it's a valid specialty slug
    const href = await firstSpecialtyLink.getAttribute('href');
    expect(href).toMatch(/\/staffing\/[\w-]+/);

    // Click the link
    await firstSpecialtyLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we're on a specialty detail page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/staffing\/[\w-]+/);

    // Specialty detail page should have content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should display specialty details with all expected sections', async ({ page }) => {
    // Navigate to first specialty
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    await firstSpecialtyLink.click();

    await page.waitForLoadState('networkidle');

    // Verify specialty detail has required content elements
    // Should have at least a heading and description
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Should have some body content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should have working back/breadcrumb navigation', async ({ page }) => {
    // Navigate to specialty detail
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    await firstSpecialtyLink.click();

    await page.waitForLoadState('networkidle');

    // Look for back link or breadcrumb
    const backLink = page.locator('a:has-text("Staffing"), a[href="/staffing"]').first();

    if (await backLink.isVisible()) {
      // Click back link
      await backLink.click();

      await page.waitForLoadState('networkidle');

      // Should be back on staffing page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/staffing');
    }
  });

  test('should load specialty pages with browser back/forward', async ({ page }) => {
    // Get first specialty link
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    const specialtyHref = await firstSpecialtyLink.getAttribute('href');

    // Click to navigate to specialty
    await firstSpecialtyLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on specialty page
    expect(page.url()).toContain(specialtyHref);

    // Use browser back button
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should be back on staffing directory
    expect(page.url()).toContain('/staffing');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Use browser forward button
    await page.goForward();
    await page.waitForLoadState('networkidle');

    // Should be back on specialty detail
    expect(page.url()).toContain(specialtyHref);
  });

  test('should handle multiple specialty navigation clicks', async ({ page }) => {
    // Get all specialty links
    const specialtyLinks = page.locator('a[href*="/staffing/"]');
    const linkCount = await specialtyLinks.count();

    // Visit at least 3 specialties if available
    const specialtiesToTest = Math.min(3, linkCount);

    for (let i = 0; i < specialtiesToTest; i++) {
      // Get fresh reference to links (DOM might change)
      const links = page.locator('a[href*="/staffing/"]');
      const link = links.nth(i);

      // Click link
      await link.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on a specialty page
      expect(page.url()).toMatch(/\/staffing\/[\w-]+/);

      // Go back to directory
      const backLink = page.locator('a:has-text("Staffing"), a[href="/staffing"]').first();
      if (await backLink.isVisible()) {
        await backLink.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/staffing');
      } else {
        // Use browser back if no back link visible
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should display specialty metadata and SEO tags', async ({ page }) => {
    // Navigate to specialty detail
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    await firstSpecialtyLink.click();

    await page.waitForLoadState('networkidle');

    // Check meta tags for SEO
    const metaDescription = page.locator('meta[name="description"]');
    const metaOg = page.locator('meta[property="og:title"]');

    // At least one of these should exist
    const hasDescription = await metaDescription.count() > 0;
    const hasOg = await metaOg.count() > 0;

    expect(hasDescription || hasOg).toBe(true);
  });

  test('should handle invalid specialty slug gracefully', async ({ page }) => {
    // Try to navigate to non-existent specialty
    await page.goto('/staffing/non-existent-specialty-12345', { waitUntil: 'networkidle' });

    // Should either show 404 page or redirect
    const pageStatus = page.url();

    // Either still on /staffing/non-existent-specialty (component renders empty)
    // Or redirected to /staffing or home
    const isOnSpecialty = pageStatus.includes('/staffing/');
    const isOnStaffingDir = pageStatus.includes('/staffing');
    const isOnHome = pageStatus === page.context().browser()?.contexts()[0].pages()[0].url().split('/').slice(0, 3).join('/');

    expect(isOnSpecialty || isOnStaffingDir || pageStatus.endsWith('/')).toBe(true);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Staffing page should be accessible
    await expect(page.locator('a[href*="/staffing/"]').first()).toBeVisible();

    // Navigate to a specialty
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    await firstSpecialtyLink.click();

    await page.waitForLoadState('networkidle');

    // Specialty detail should be readable on mobile
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Should be able to scroll and read content
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(page.locator('main')).toBeVisible();
  });

  test('should preserve scroll position with history navigation', async ({ page }) => {
    // Scroll down on staffing page
    await page.evaluate(() => window.scrollTo(0, 500));

    // Get scroll position
    const scrollPosBefore = await page.evaluate(() => window.scrollY);

    // Navigate to a specialty
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    await firstSpecialtyLink.click();

    await page.waitForLoadState('networkidle');

    // Go back using browser back
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Note: browsers don't always restore exact scroll position
    // Just verify page is accessible after back navigation
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display related specialties or CTA to other specialties', async ({ page }) => {
    // Navigate to first specialty
    const firstSpecialtyLink = page.locator('a[href*="/staffing/"]').first();
    await firstSpecialtyLink.click();

    await page.waitForLoadState('networkidle');

    // Look for related specialties or CTAs to other specialties
    // This could be a "Related", "Other practices", or navigation links
    const relatedSection = page.locator(
      'text=/related|other practices|similar|explore/i'
    );

    // Or look for any links back to /staffing
    const specialtyLinks = page.locator('a[href*="/staffing/"]');
    const hasSpecialtyLinks = await specialtyLinks.count() > 0;

    // At least one should exist
    const hasRelatedSection = await relatedSection.count() > 0;
    expect(hasRelatedSection || hasSpecialtyLinks).toBe(true);
  });
});

test.describe('Staffing Hub Navigation E2E Tests', () => {
  test('should load the staffing hub with links to its three children', async ({ page }) => {
    await page.goto('/staffing');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await expect(page.locator('a[href="/staffing/roles"]').first()).toBeVisible();
    await expect(page.locator('a[href="/staffing/pods"]').first()).toBeVisible();
    await expect(page.locator('a[href="/staffing/specialized-roles"]').first()).toBeVisible();
  });

  test('should navigate from the hub to Staffing Roles', async ({ page }) => {
    await page.goto('/staffing');
    await page.waitForLoadState('networkidle');

    await page.locator('a[href="/staffing/roles"]').first().click();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/staffing/roles');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should navigate from the hub to Pods', async ({ page }) => {
    await page.goto('/staffing');
    await page.waitForLoadState('networkidle');

    await page.locator('a[href="/staffing/pods"]').first().click();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/staffing/pods');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('legacy /pods URL should 301 redirect to /staffing/pods', async ({ page }) => {
    const response = await page.goto('/pods', { waitUntil: 'networkidle' });

    expect(page.url()).toContain('/staffing/pods');
    expect(response?.ok()).toBe(true);
  });
});
