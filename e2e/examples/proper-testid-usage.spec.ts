import { test, expect, getByTestId, clickTestId, fillTestId } from '../utils/test-helpers';

/**
 * This file demonstrates the proper way to write E2E tests using data-testid attributes.
 *
 * Best Practices:
 * 1. Always use data-testid for element selection
 * 2. Use semantic, descriptive test IDs
 * 3. Avoid relying on text content or CSS classes
 * 4. Make test IDs consistent across the application
 */

test.describe('Proper E2E Testing with data-testid', () => {
  test('example: client admission with proper test IDs', async ({ page }) => {
    await page.goto('/admission');

    // ❌ BAD: Selecting by text or generic selectors
    // await page.click('button:has-text("Next")');
    // await page.fill('input[name="firstName"]', 'John');

    // ✅ GOOD: Using data-testid
    await fillTestId(page, 'admission-firstName-input', 'John');
    await fillTestId(page, 'admission-lastName-input', 'Doe');
    await fillTestId(page, 'admission-email-input', 'john.doe@example.com');
    await fillTestId(page, 'admission-phoneNumber-input', '9876543210');

    await clickTestId(page, 'admission-next-button');

    // Verify step progression
    await expect(getByTestId(page, 'admission-step-2')).toBeVisible();
  });

  test('example: vehicle management with proper test IDs', async ({ page }) => {
    await page.goto('/vehicles');

    // ✅ GOOD: Using data-testid for all interactions
    await clickTestId(page, 'vehicles-add-button');

    // Fill vehicle form
    await fillTestId(page, 'vehicle-registrationNumber-input', 'MH01AB1234');
    await fillTestId(page, 'vehicle-make-input', 'Toyota');
    await fillTestId(page, 'vehicle-model-input', 'Corolla');

    // Select from dropdown using data-testid
    await getByTestId(page, 'vehicle-type-select').selectOption('LMV');
    await getByTestId(page, 'vehicle-fuelType-select').selectOption('Petrol');

    // Submit form
    await clickTestId(page, 'vehicle-save-button');

    // Verify vehicle appears in list
    await expect(getByTestId(page, 'vehicle-row-MH01AB1234')).toBeVisible();
  });

  test('example: table interactions with proper test IDs', async ({ page }) => {
    await page.goto('/clients');

    // ✅ GOOD: Each table row has a unique test ID
    const clientRow = getByTestId(page, 'client-row-123'); // where 123 is the client ID

    // Click on specific actions within the row
    await clientRow.locator('[data-testid="client-edit-button"]').click();

    // Or click on the row itself
    await clickTestId(page, 'client-row-123');

    // Verify navigation
    await expect(getByTestId(page, 'client-details-page')).toBeVisible();
  });

  test('example: form validation with proper test IDs', async ({ page }) => {
    await page.goto('/admission');

    // Try to submit without filling required fields
    await clickTestId(page, 'admission-next-button');

    // Check for validation errors using test IDs
    await expect(getByTestId(page, 'admission-firstName-error')).toBeVisible();
    await expect(getByTestId(page, 'admission-firstName-error')).toHaveText(
      'First name is required'
    );

    // Fill the field and verify error disappears
    await fillTestId(page, 'admission-firstName-input', 'John');
    await expect(getByTestId(page, 'admission-firstName-error')).not.toBeVisible();
  });

  test('example: modal/dialog interactions with proper test IDs', async ({ page }) => {
    await page.goto('/vehicles');

    // Open modal
    await clickTestId(page, 'vehicles-add-button');

    // Verify modal is open
    await expect(getByTestId(page, 'vehicle-add-modal')).toBeVisible();

    // Close modal
    await clickTestId(page, 'modal-close-button');

    // Verify modal is closed
    await expect(getByTestId(page, 'vehicle-add-modal')).not.toBeVisible();
  });

  test('example: list filtering with proper test IDs', async ({ page }) => {
    await page.goto('/clients');

    // Use search input
    await fillTestId(page, 'clients-search-input', 'John');

    // Apply filters
    await getByTestId(page, 'clients-status-filter').selectOption('active');
    await getByTestId(page, 'clients-branch-filter').selectOption('branch-1');

    // Apply date range
    await fillTestId(page, 'clients-dateFrom-input', '2024-01-01');
    await fillTestId(page, 'clients-dateTo-input', '2024-12-31');

    await clickTestId(page, 'clients-apply-filters-button');

    // Verify filtered results
    const results = page.locator('[data-testid^="client-row-"]');
    await expect(results).toHaveCount(5); // Expecting 5 results
  });
});

/**
 * Recommended data-testid naming conventions:
 *
 * 1. Pages: {page}-page
 *    Example: dashboard-page, clients-page
 *
 * 2. Forms: {context}-{field}-input/select/checkbox
 *    Example: admission-firstName-input, vehicle-type-select
 *
 * 3. Buttons: {context}-{action}-button
 *    Example: admission-next-button, vehicle-save-button
 *
 * 4. Errors: {context}-{field}-error
 *    Example: admission-firstName-error
 *
 * 5. Tables: {entity}-table, {entity}-row-{id}
 *    Example: clients-table, client-row-123
 *
 * 6. Modals: {context}-{action}-modal
 *    Example: vehicle-add-modal, client-edit-modal
 *
 * 7. Lists: {entity}-list, {entity}-item-{id}
 *    Example: vehicles-list, vehicle-item-MH01AB1234
 *
 * 8. Status/States: {context}-{state}
 *    Example: payment-status-completed, vehicle-status-active
 */
