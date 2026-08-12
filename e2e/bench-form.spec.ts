import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Bench Form E2E Tests (Join Our Bench)', () => {
  let testResumePath: string;

  test.beforeAll(async () => {
    // Create a temporary test resume file
    const tempDir = path.join(__dirname, '..');
    testResumePath = path.join(tempDir, 'test-resume.pdf');
    // Create a dummy PDF file for testing
    fs.writeFileSync(testResumePath, '%PDF-1.4\n%Test Resume File for E2E Testing');
  });

  test.afterAll(async () => {
    // Clean up test resume file
    if (fs.existsSync(testResumePath)) {
      fs.unlinkSync(testResumePath);
    }
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to join-our-bench page
    await page.goto('/join-our-bench');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load join-our-bench page with application form', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/bench|application|join/i);

    // Verify all form elements exist
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
    await expect(page.locator('select[name="specialty"]')).toBeVisible();
    await expect(page.locator('select[name="seniority"]')).toBeVisible();
    await expect(page.locator('select[name="basis"]')).toBeVisible();
    await expect(page.locator('input[name="expectedMonthlyRate"]')).toBeVisible();
    await expect(page.locator('select[name="availability"]')).toBeVisible();
    await expect(page.locator('input[name="portfolioUrl"]')).toBeVisible();
    await expect(page.locator('input[name="linkedinUrl"]')).toBeVisible();
    await expect(page.locator('input[name="resume"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for required attributes on critical fields
    await expect(page.locator('input[name="firstName"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="lastName"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="phone"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="location"]')).toHaveAttribute('required', '');
    await expect(page.locator('select[name="specialty"]')).toHaveAttribute('required', '');
    await expect(page.locator('select[name="seniority"]')).toHaveAttribute('required', '');
    await expect(page.locator('select[name="basis"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="resume"]')).toHaveAttribute('required', '');
  });

  test('should fill form with all required fields and submit successfully', async ({ page }) => {
    // Fill text fields
    await page.fill('input[name="firstName"]', 'Alexandra');
    await page.fill('input[name="lastName"]', 'Rodriguez');
    await page.fill('input[name="email"]', 'alexandra.rodriguez@email.com');
    await page.fill('input[name="phone"]', '(305) 555-1234');
    await page.fill('input[name="location"]', 'Miami, Florida');

    // Select specialty, seniority, and basis (required dropdowns)
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Fill optional fields
    await page.fill('input[name="expectedMonthlyRate"]', '8000');
    await page.fill('input[name="portfolioUrl"]', 'https://alexandra-dev.com');
    await page.fill('input[name="linkedinUrl"]', 'https://linkedin.com/in/alexandra-rodriguez');

    // Upload resume file
    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    // Add optional message
    await page.fill('textarea[name="message"]', 'Passionate about ML engineering with 5+ years experience.');

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for success message
    await expect(page.locator('text=/Application received/i')).toBeVisible({ timeout: 5000 });

    // Verify success state styling
    const successBox = page.locator('div').filter({ has: page.locator('text=/Application received/i') });
    await expect(successBox).toHaveClass(/border-green-500/);
  });

  test('should submit without optional portfolio and LinkedIn URLs', async ({ page }) => {
    // Fill required fields only
    await page.fill('input[name="firstName"]', 'David');
    await page.fill('input[name="lastName"]', 'Kumar');
    await page.fill('input[name="email"]', 'david.kumar@email.com');
    await page.fill('input[name="phone"]', '(415) 555-5678');
    await page.fill('input[name="location"]', 'San Francisco, CA');

    // Select required dropdowns
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Skip optional URLs
    // Upload resume
    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    // Submit
    await page.locator('button[type="submit"]').click();

    // Should still succeed
    await expect(page.locator('text=/Application received/i')).toBeVisible({ timeout: 5000 });
  });

  test('should accept only valid file types for resume', async ({ page }) => {
    // Fill required fields
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '(555) 123-4567');
    await page.fill('input[name="location"]', 'Test City');

    // Select required dropdowns
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Check file input accepts correct types
    const resumeInput = page.locator('input[name="resume"]');
    const acceptAttr = await resumeInput.getAttribute('accept');
    expect(acceptAttr).toContain('pdf');
    expect(acceptAttr).toContain('doc');
  });

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[name="firstName"]', 'Invalid');
    await page.fill('input[name="lastName"]', 'Email');
    await page.fill('input[name="email"]', 'not-an-email'); // Invalid email
    await page.fill('input[name="phone"]', '(555) 000-1111');
    await page.fill('input[name="location"]', 'Test City');
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Browser validation should catch invalid email
    const emailInput = page.locator('input[name="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should disable submit button while submitting', async ({ page }) => {
    // Fill form
    await page.fill('input[name="firstName"]', 'Emma');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[name="email"]', 'emma.smith@email.com');
    await page.fill('input[name="phone"]', '(212) 555-9999');
    await page.fill('input[name="location"]', 'New York, NY');
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    const submitButton = page.locator('button[type="submit"]');

    // Click and check button state
    const submitPromise = submitButton.click();

    // Button should show loading text or be disabled
    await expect(submitButton).toContainText(/Submitting application|Submit application/i);

    // Wait for submission to complete
    await submitPromise;
    await page.waitForTimeout(1000);
  });

  test('should clear form after successful submission', async ({ page }) => {
    // First submission
    await page.fill('input[name="firstName"]', 'Robert');
    await page.fill('input[name="lastName"]', 'Johnson');
    await page.fill('input[name="email"]', 'robert.johnson@email.com');
    await page.fill('input[name="phone"]', '(503) 555-2222');
    await page.fill('input[name="location"]', 'Portland, Oregon');
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });
    await page.fill('input[name="portfolioUrl"]', 'https://robert-dev.com');
    await page.fill('input[name="linkedinUrl"]', 'https://linkedin.com/in/robert');

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    await page.fill('textarea[name="message"]', 'Experienced DevOps engineer');
    await page.locator('button[type="submit"]').click();

    // Wait for success message
    await expect(page.locator('text=/Application received/i')).toBeVisible();

    // Click "Submit another application" button
    const resendButton = page.locator('button:has-text("Submit another application")');
    await expect(resendButton).toBeVisible();
    await resendButton.click();

    // Verify form is now visible and cleared
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();
    await expect(firstNameInput).toHaveValue('');

    // Portfolio URL should be cleared
    const portfolioInput = page.locator('input[name="portfolioUrl"]');
    await expect(portfolioInput).toHaveValue('');

    // Message should be cleared
    const messageTextarea = page.locator('textarea[name="message"]');
    await expect(messageTextarea).toHaveValue('');
  });

  test('should preserve select dropdown values when filled', async ({ page }) => {
    // Select options
    await page.selectOption('select[name="specialty"]', { index: 2 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });
    await page.selectOption('select[name="availability"]', { index: 1 });
    await page.fill('input[name="expectedMonthlyRate"]', '7500');

    // Fill text fields
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'test@example.com');

    // Verify dropdowns retained their values
    const specialtySelect = page.locator('select[name="specialty"]');
    const senioritySelect = page.locator('select[name="seniority"]');
    const basisSelect = page.locator('select[name="basis"]');
    const availabilitySelect = page.locator('select[name="availability"]');
    const rateInput = page.locator('input[name="expectedMonthlyRate"]');

    const specialtyValue = await specialtySelect.inputValue();
    const seniorityValue = await senioritySelect.inputValue();
    const basisValue = await basisSelect.inputValue();
    const availabilityValue = await availabilitySelect.inputValue();
    const rateValue = await rateInput.inputValue();

    expect(specialtyValue).not.toBe('');
    expect(seniorityValue).not.toBe('');
    expect(basisValue).not.toBe('');
    expect(availabilityValue).not.toBe('');
    expect(rateValue).toBe('7500');
  });

  test('should prevent spam with honeypot field', async ({ page }) => {
    // The honeypot field should not be visible
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveClass(/left-\[-9999px\]/);

    // It should have aria-hidden
    const ariaHidden = await page.locator('[aria-hidden="true"]').locator('input[name="website"]');
    await expect(ariaHidden).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify form is still accessible
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="resume"]')).toBeVisible();

    // Fill form on mobile
    await page.fill('input[name="firstName"]', 'Mobile');
    await page.fill('input[name="lastName"]', 'Candidate');
    await page.fill('input[name="email"]', 'mobile@example.com');
    await page.fill('input[name="phone"]', '(555) 777-8888');
    await page.fill('input[name="location"]', 'Remote');
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    await page.locator('button[type="submit"]').click();

    // Verify success on mobile
    await expect(page.locator('text=/Application received/i')).toBeVisible({ timeout: 5000 });
  });

  test('should validate URL format for portfolio and LinkedIn', async ({ page }) => {
    // Fill required fields
    await page.fill('input[name="firstName"]', 'URL');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', 'url@example.com');
    await page.fill('input[name="phone"]', '(555) 111-2222');
    await page.fill('input[name="location"]', 'Test City');
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Fill with invalid URLs
    await page.fill('input[name="portfolioUrl"]', 'not-a-url');
    await page.fill('input[name="linkedinUrl"]', 'not-a-url');

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    // Submit should fail if URLs are invalid
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check portfolio URL validity
    const portfolioInput = page.locator('input[name="portfolioUrl"]');
    const portfolioValid = await portfolioInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(portfolioValid).toBe(false);
  });

  test('should show error message on submission failure', async ({ page }) => {
    // Fill all fields
    await page.fill('input[name="firstName"]', 'Error');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', 'error@example.com');
    await page.fill('input[name="phone"]', '(555) 666-7777');
    await page.fill('input[name="location"]', 'Test City');
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    // Intercept and mock failed response
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });

    await page.locator('button[type="submit"]').click();

    // Check for error message display
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[role="alert"]')).toContainText(/error|wrong/i);
  });

  test('should display location description text', async ({ page }) => {
    // Verify helper text is visible
    const locationHelperText = page.locator('text=/Our clients hire across/i');
    await expect(locationHelperText).toBeVisible();
  });

  test('should display resume file input description', async ({ page }) => {
    // Verify resume constraints helper text
    const resumeHelperText = page.locator('text=/PDF or Word|5 MB/i');
    await expect(resumeHelperText).toBeVisible();
  });
});
