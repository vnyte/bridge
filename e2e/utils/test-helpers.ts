import { test as base, expect, type Page, type Locator } from '@playwright/test';

export const test = base.extend({
  // Add any custom fixtures here
});

export { expect };

export const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  organizationName: 'Test Driving School',
};

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  admission: '/admission',
  vehicles: '/vehicles',
  clients: '/clients',
  payments: '/payments',
};

export async function waitForAuth(page: Page): Promise<void> {
  // Wait for authentication to complete
  await page.waitForURL(/^((?!sign-in|sign-up).)*$/);
  await page.waitForLoadState('networkidle');
}

export async function fillForm(page: Page, formData: Record<string, unknown>): Promise<void> {
  for (const [field, value] of Object.entries(formData)) {
    // First try data-testid, then fall back to name attribute
    let input = page.locator(`[data-testid="${field}"]`);
    if ((await input.count()) === 0) {
      input = page.locator(
        `input[name="${field}"], select[name="${field}"], textarea[name="${field}"]`
      );
    }

    if ((await input.count()) > 0) {
      const inputType = await input.getAttribute('type');
      if (inputType === 'checkbox') {
        if (value) await input.check();
        else await input.uncheck();
      } else if (inputType === 'radio') {
        await page.locator(`input[name="${field}"][value="${value}"]`).check();
      } else if (await input.evaluate((el: Element) => el.tagName === 'SELECT')) {
        await input.selectOption(String(value));
      } else {
        await input.fill(String(value));
      }
    }
  }
}

// Helper to get element by data-testid
export function getByTestId(page: Page, testId: string): Locator {
  return page.locator(`[data-testid="${testId}"]`);
}

// Helper to click element by data-testid
export async function clickTestId(page: Page, testId: string): Promise<void> {
  await page.locator(`[data-testid="${testId}"]`).click();
}

// Helper to fill input by data-testid
export async function fillTestId(page: Page, testId: string, value: string): Promise<void> {
  await page.locator(`[data-testid="${testId}"]`).fill(value);
}

export async function waitForToast(page: Page, text?: string): Promise<Locator> {
  const toast = text
    ? page.locator('[data-sonner-toast]', { hasText: text })
    : page.locator('[data-sonner-toast]');

  await expect(toast).toBeVisible({ timeout: 10000 });
  return toast;
}
