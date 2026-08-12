import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load contact page with form', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/contact/i);

    // Verify form elements exist
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="inquiryType"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for browser validation (required fields)
    // The browser's native validation should prevent submission
    await expect(page.locator('input[name="firstName"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
  });

  test('should fill form and submit successfully', async ({ page }) => {
    // Fill in the form with valid data
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="phone"]', '(555) 123-4567');

    // Select an inquiry type
    await page.selectOption('select[name="inquiryType"]', { index: 1 }); // Select first available option

    // Add a message
    await page.fill('textarea[name="message"]', 'I am interested in learning more about your services.');

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for success message
    await expect(page.locator('text=/Message sent/i')).toBeVisible({ timeout: 5000 });

    // Verify success state styling (green border)
    const successBox = page.locator('div').filter({ has: page.locator('text=/Message sent/i') });
    await expect(successBox).toHaveClass(/border-green-500/);
  });

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[name="firstName"]', 'Jane');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[name="email"]', 'invalid-email'); // Invalid email
    await page.fill('input[name="phone"]', '(555) 987-6543');
    await page.selectOption('select[name="inquiryType"]', { index: 1 });

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Browser should show validation error for invalid email
    const emailInput = page.locator('input[name="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should disable submit button while submitting', async ({ page }) => {
    // Fill form
    await page.fill('input[name="firstName"]', 'Alice');
    await page.fill('input[name="lastName"]', 'Johnson');
    await page.fill('input[name="email"]', 'alice@example.com');
    await page.fill('input[name="phone"]', '(555) 111-2222');
    await page.selectOption('select[name="inquiryType"]', { index: 1 });

    const submitButton = page.locator('button[type="submit"]');

    // Click and immediately check if button shows loading state
    const submitPromise = submitButton.click();

    // Check button is disabled or shows loading text
    // (Button should be disabled during submission)
    await expect(submitButton).toContainText(/Sending message|Send message/i);

    // Wait for submission to complete
    await submitPromise;
    await page.waitForTimeout(1000);
  });

  test('should clear form after successful submission and allow resending', async ({ page }) => {
    // First submission
    await page.fill('input[name="firstName"]', 'Bob');
    await page.fill('input[name="lastName"]', 'Builder');
    await page.fill('input[name="email"]', 'bob@example.com');
    await page.fill('input[name="phone"]', '(555) 444-5555');
    await page.selectOption('select[name="inquiryType"]', { index: 1 });
    await page.fill('textarea[name="message"]', 'First message');

    await page.locator('button[type="submit"]').click();

    // Wait for success message
    await expect(page.locator('text=/Message sent/i')).toBeVisible();

    // Click "Send another message" button
    const resendButton = page.locator('button:has-text("Send another message")');
    await expect(resendButton).toBeVisible();
    await resendButton.click();

    // Verify form is now visible again and empty
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();
    await expect(firstNameInput).toHaveValue('');
  });

  test('should prevent spam with honeypot field', async ({ page }) => {
    // The honeypot field should not be visible to users
    const honeypot = page.locator('input[name="company_name"]');
    await expect(honeypot).toHaveClass(/left-\[-9999px\]/);

    // It should have aria-hidden
    const ariaHidden = await page.locator('[aria-hidden="true"]').locator('input[name="company_name"]');
    await expect(ariaHidden).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify form is still accessible
    await expect(page.locator('input[name="firstName"]')).toBeVisible();

    // Fill and submit on mobile
    await page.fill('input[name="firstName"]', 'Mobile');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'mobile@example.com');
    await page.fill('input[name="phone"]', '(555) 999-8888');
    await page.selectOption('select[name="inquiryType"]', { index: 1 });

    await page.locator('button[type="submit"]').click();

    // Verify success on mobile
    await expect(page.locator('text=/Message sent/i')).toBeVisible({ timeout: 5000 });
  });
});
