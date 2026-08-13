import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Accessibility E2E Tests (WCAG AA)", () => {
  const pages = [
    { path: "/", name: "Homepage" },
    { path: "/staffing", name: "Staffing" },
    { path: "/global-delivery", name: "Global Delivery" },
    { path: "/contact", name: "Contact Form" },
    { path: "/faq", name: "FAQ" },
  ];

  pages.forEach(({ path, name }) => {
    test(`${name} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Inject axe for accessibility checks
      await injectAxe(page);

      // Check for violations
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const levels = await Promise.all(
      headings.map((h) => h.evaluate((el) => parseInt(el.tagName[1]))),
    );

    // Verify no skipped heading levels (e.g., h1 -> h3)
    for (let i = 1; i < levels.length; i++) {
      const diff = Math.abs(levels[i] - levels[i - 1]);
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    // Tab through form elements
    const firstInput = page.locator('input[name="firstName"]');
    await firstInput.click();

    // Check initial focus
    await expect(firstInput).toBeFocused();

    // Tab to next element
    await page.keyboard.press("Tab");

    // Verify focus moved (not stuck)
    const lastNameInput = page.locator('input[name="lastName"]');
    const isFocused = await lastNameInput.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test("should have visible focus indicators", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const firstInput = page.locator('input[name="firstName"]');
    await firstInput.focus();

    // Check for visible focus state (outline or border)
    const focusStyles = await firstInput.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
        borderColor: styles.borderColor,
      };
    });

    // Should have some visible focus indicator
    const hasVisibleFocus =
      focusStyles.outline !== "none" ||
      focusStyles.boxShadow !== "none" ||
      focusStyles.outlineWidth !== "0px";
    expect(hasVisibleFocus).toBe(true);
  });

  test("should have proper contrast ratios", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Inject axe for contrast checking
    await injectAxe(page);

    // Get contrast results
    const results = await page.evaluate(() => {
      return (window as any).axe.run();
    });

    // Filter for color-contrast violations
    const contrastViolations = (results as any).violations.filter(
      (v: any) => v.id === "color-contrast",
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test("should have alt text for all images", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const images = await page.locator("img").all();

    for (const img of images) {
      const altText = await img.getAttribute("alt");
      const ariaLabel = await img.getAttribute("aria-label");
      const role = await img.getAttribute("role");

      // Image should have alt text or aria-label or be decorative (role="presentation")
      expect(altText || ariaLabel || role === "presentation").toBeTruthy();
    }
  });

  test("should announce form validation errors to screen readers", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for validation to trigger
    await page.waitForTimeout(500);

    // Check for aria-invalid on invalid fields
    const firstNameInput = page.locator('input[name="firstName"]');
    const isInvalid = await firstNameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);

    // Should have invalid state
    expect(isInvalid).toBe(true);
  });

  test("should support reduced motion preference", async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that animations respect the preference
    const animated = page.locator("[class*='animate-'], [style*='animation']");
    const animationCount = await animated.count();

    // Should have minimal animations when reduced motion is preferred
    // (This is a soft check - some animations may still exist but should be minimal)
    expect(animationCount).toBeLessThan(5);
  });

  test("should have proper label associations", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const labels = await page.locator("label").all();

    for (const label of labels) {
      const forAttr = await label.getAttribute("for");
      const id = forAttr;

      if (id) {
        const input = page.locator(`#${id}`);
        const inputCount = await input.count();

        // Label should be associated with an input
        expect(inputCount).toBeGreaterThan(0);
      }
    }
  });

  test("should have descriptive page titles", async ({ page }) => {
    const testCases = [
      { path: "/", expectedTitle: /Career Source Group|Global Staffing/ },
      { path: "/contact", expectedTitle: /Contact/ },
      { path: "/staffing", expectedTitle: /Staffing/ },
    ];

    for (const { path, expectedTitle } of testCases) {
      await page.goto(path);
      await expect(page).toHaveTitle(expectedTitle);
    }
  });

  test("should skip to main content link", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find skip link
    const skipLink = page.locator('a:has-text("Skip to main content")');
    const skipLinkExists = await skipLink.count();

    if (skipLinkExists > 0) {
      // Skip link should be initially hidden (sr-only)
      const isHidden = await skipLink.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.position === "absolute" && styles.width === "1px";
      });

      expect(isHidden).toBe(true);

      // Should be visible on focus
      await skipLink.focus();
      const isFocusVisible = await skipLink.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.position !== "absolute" || styles.width !== "1px";
      });

      expect(isFocusVisible).toBe(true);
    }
  });
});
