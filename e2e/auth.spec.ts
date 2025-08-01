import {
  test,
  expect,
  ROUTES,
  getByTestId,
  clickTestId,
  fillTestId,
  waitForAuth,
  TEST_USER,
} from './utils/test-helpers';

test.describe('Authentication', () => {
  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    await page.goto(ROUTES.dashboard);
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show sign-in page with correct elements', async ({ page }) => {
    await page.goto(ROUTES.signIn);

    // Check for sign-in page elements
    await expect(getByTestId(page, 'signin-page')).toBeVisible();
    await expect(getByTestId(page, 'signin-heading')).toBeVisible();
    await expect(getByTestId(page, 'signin-email-input')).toBeVisible();
    await expect(getByTestId(page, 'signin-submit-button')).toBeVisible();

    // Check for sign-up link
    await expect(getByTestId(page, 'signin-signup-link')).toBeVisible();
  });

  test('should show sign-up page with correct elements', async ({ page }) => {
    await page.goto(ROUTES.signUp);

    // Check for sign-up page elements
    await expect(getByTestId(page, 'signup-page')).toBeVisible();
    await expect(getByTestId(page, 'signup-heading')).toBeVisible();
    await expect(getByTestId(page, 'signup-email-input')).toBeVisible();
    await expect(getByTestId(page, 'signup-submit-button')).toBeVisible();

    // Check for sign-in link
    await expect(getByTestId(page, 'signup-signin-link')).toBeVisible();
  });

  test('should handle sign-in errors', async ({ page }) => {
    await page.goto(ROUTES.signIn);

    // Try to sign in with invalid credentials
    await fillTestId(page, 'signin-email-input', 'invalid@example.com');
    await clickTestId(page, 'signin-submit-button');

    // Wait for password field to appear
    await expect(getByTestId(page, 'signin-password-input')).toBeVisible({ timeout: 5000 });
    await fillTestId(page, 'signin-password-input', 'wrongpassword');
    await clickTestId(page, 'signin-submit-button');

    // Check for error message
    await expect(getByTestId(page, 'signin-error-message')).toBeVisible({ timeout: 10000 });
  });

  test.skip('should successfully sign in and redirect to dashboard', async ({ page }) => {
    // This test requires a real Clerk account or test mode setup
    await page.goto(ROUTES.signIn);

    // Fill in credentials
    await page.fill('input[name="identifier"]', TEST_USER.email);
    await page.click('button[type="submit"]');

    // Wait for password field
    await page.waitForSelector('input[name="password"]');
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for authentication and redirect
    await waitForAuth(page);
    await expect(page).toHaveURL(ROUTES.dashboard);

    // Verify dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should have functioning navigation between sign-in and sign-up', async ({ page }) => {
    // Start at sign-in
    await page.goto(ROUTES.signIn);

    // Navigate to sign-up
    await clickTestId(page, 'signin-signup-link');
    await expect(page).toHaveURL(/.*sign-up/);

    // Navigate back to sign-in
    await clickTestId(page, 'signup-signin-link');
    await expect(page).toHaveURL(/.*sign-in/);
  });
});
