# E2E Tests - Career Source Group

End-to-end tests for critical user flows using Playwright.

## Setup

Playwright is installed and configured. No additional setup needed!

## Running Tests

### Run all tests (headless)
```bash
pnpm test:e2e
```

### Run tests with UI (interactive)
```bash
pnpm test:e2e:ui
```
This opens Playwright's interactive test runner where you can see tests execute in real-time.

### Debug mode
```bash
pnpm test:e2e:debug
```
Opens browser with dev tools for step-by-step debugging.

### Run specific test file
```bash
pnpm test:e2e e2e/contact-form.spec.ts
```

### Run tests in headed mode (see browser)
```bash
pnpm test:e2e --headed
```

## Test Structure

### contact-form.spec.ts (Test #1: Critical)
Tests the **Contact Form** submission flow on `/contact` page.

**Test Cases:**
1. ✅ Page loads with form elements
2. ✅ Empty form validation
3. ✅ Successful form submission → success message
4. ✅ Email format validation
5. ✅ Submit button disabled during submission
6. ✅ Form clears after success + ability to resend
7. ✅ Honeypot spam prevention field
8. ✅ Mobile viewport responsiveness

**What it validates:**
- Form elements render correctly
- Required field validation works
- Form submission succeeds and shows success message
- Form state management (clearing, resending)
- Spam prevention (honeypot field)
- Mobile responsiveness

**Key Assertions:**
```typescript
// Check form loads
await expect(page.locator('input[name="firstName"]')).toBeVisible();

// Fill form
await page.fill('input[name="firstName"]', 'John');

// Submit
await page.locator('button[type="submit"]').click();

// Verify success
await expect(page.locator('text=/Message sent/i')).toBeVisible();
```

## How Tests Work

Each test:
1. **Setup** - Navigate to page and wait for load
2. **Action** - Interact with form (fill fields, click button)
3. **Assert** - Verify expected outcome (success message, validation, state change)

Example:
```typescript
test('should fill form and submit successfully', async ({ page }) => {
  // Setup - navigate to contact page
  await page.goto('/contact');
  
  // Action - fill form
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="email"]', 'john@example.com');
  
  // Action - submit
  await page.locator('button[type="submit"]').click();
  
  // Assert - verify success
  await expect(page.locator('text=/Message sent/i')).toBeVisible();
});
```

## Test Reports

After running tests, Playwright generates an HTML report:
```bash
pnpm test:e2e
# Report opens automatically at: playwright-report/index.html
```

Reports show:
- ✅ Passed/failed tests
- 🎬 Video recordings of failures
- 📸 Screenshots at each step
- Timing and performance

## Browser Coverage

Tests run on:
- Chromium (Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5 mobile emulation)

This ensures form works across all major browsers and devices.

## CI/CD Integration

In your CI pipeline, add:
```yaml
- name: Run E2E tests
  run: pnpm test:e2e
```

Tests will:
- Retry failed tests twice automatically
- Run serially (one browser at a time) in CI
- Generate HTML report artifact
- Fail CI if any test fails

## Common Issues

### Tests fail to run
- Make sure dev server is running: `pnpm dev`
- Or let Playwright start it automatically (configured in `playwright.config.ts`)

### Form doesn't submit
- Check if email service is configured (check `.env.local`)
- Review form submission handler in `src/lib/forms.ts`

### Timeout waiting for success message
- Form submission might be failing silently
- Check browser console for errors: `pnpm test:e2e --headed`

## Next Steps

After validating this test works:
1. Write Test #2: Get Started / Requirement Form
2. Write Test #3: Join Our Bench / Talent Application
3. Write Test #4: Staffing Detail Navigation
4. Write Test #5: Regional Global Delivery Pages

See main improvement list for all 12 planned tests.
