import {
  test,
  expect,
  ROUTES,
  getByTestId,
  clickTestId,
  fillTestId,
  waitForToast,
} from './utils/test-helpers';
import { mockDrivingLicense } from './utils/mock-data';

test.describe('Client Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.clients);
  });

  test('should display clients listing page', async ({ page }) => {
    // Check page elements
    await expect(getByTestId(page, 'clients-page')).toBeVisible();
    await expect(getByTestId(page, 'clients-page-heading')).toBeVisible();
    await expect(getByTestId(page, 'clients-add-button')).toBeVisible();
    await expect(getByTestId(page, 'clients-search-input')).toBeVisible();

    // Check table headers
    await expect(getByTestId(page, 'clients-table')).toBeVisible();
    await expect(getByTestId(page, 'clients-table-header-name')).toBeVisible();
    await expect(getByTestId(page, 'clients-table-header-contact')).toBeVisible();
    await expect(getByTestId(page, 'clients-table-header-licenses')).toBeVisible();
    await expect(getByTestId(page, 'clients-table-header-status')).toBeVisible();
    await expect(getByTestId(page, 'clients-table-header-actions')).toBeVisible();
  });

  test('should search and filter clients', async ({ page }) => {
    // Search by name
    await fillTestId(page, 'clients-search-input', 'John');
    await getByTestId(page, 'clients-search-input').press('Enter');

    // Wait for filtered results
    await page.waitForTimeout(500); // Allow debounce

    // Verify search works (would need test data)
    const rows = page.locator('[data-testid^="client-row-"]');
    const count = await rows.count();
    if (count > 0) {
      const firstRowText = await rows.first().textContent();
      expect(firstRowText?.toLowerCase()).toContain('john');
    }

    // Clear search
    await fillTestId(page, 'clients-search-input', '');
    await getByTestId(page, 'clients-search-input').press('Enter');
  });

  test('should navigate to client details page', async ({ page }) => {
    // Click on first client row
    const clientRows = page.locator('[data-testid^="client-row-"]');

    if ((await clientRows.count()) > 0) {
      // Get client ID from test ID
      const firstRow = clientRows.first();

      // Click on the row
      await firstRow.click();

      // Verify navigation to client details
      await expect(page).toHaveURL(/\/clients\/[^\/]+$/);

      // Verify client details page loaded
      await expect(getByTestId(page, 'client-details-page')).toBeVisible();
      await expect(getByTestId(page, 'client-details-heading')).toBeVisible();
    }
  });

  test('should edit client information', async ({ page }) => {
    // Navigate to first client's details
    const clientRows = page.locator('[data-testid^="client-row-"]');

    if ((await clientRows.count()) > 0) {
      await clientRows.first().click();
      await page.waitForURL(/\/clients\/[^\/]+$/);

      // Click edit button
      await clickTestId(page, 'client-edit-button');

      // Update client information
      await fillTestId(page, 'client-phoneNumber-input', '9999999999');
      await fillTestId(page, 'client-address-input', '456 Updated Street');
      await fillTestId(page, 'client-city-input', 'Updated City');

      // Save changes
      await clickTestId(page, 'client-save-button');

      // Verify success message
      await waitForToast(page, 'updated successfully');

      // Verify updated information is displayed
      await expect(getByTestId(page, 'client-phone-display')).toHaveText('9999999999');
      await expect(getByTestId(page, 'client-address-display')).toHaveText('456 Updated Street');
    }
  });

  test('should manage client licenses', async ({ page }) => {
    // Navigate to first client's details
    const clientRows = page.locator('[data-testid^="client-row-"]');

    if ((await clientRows.count()) > 0) {
      await clientRows.first().click();
      await page.waitForURL(/\/clients\/[^\/]+$/);

      // Navigate to licenses tab
      await clickTestId(page, 'client-licenses-tab');

      // Add a driving license
      await clickTestId(page, 'client-add-driving-license-button');

      // Fill driving license details
      await fillTestId(page, 'license-dlNumber-input', mockDrivingLicense.dlNumber);
      await fillTestId(page, 'license-issueDate-input', mockDrivingLicense.issueDate);
      await fillTestId(page, 'license-expiryDate-input', mockDrivingLicense.expiryDate);
      await fillTestId(page, 'license-rtoOffice-input', mockDrivingLicense.rtoOffice);

      // Select vehicle classes
      for (const vehicleClass of mockDrivingLicense.vehicleClasses) {
        await getByTestId(page, `license-vehicleClass-${vehicleClass}-checkbox`).check();
      }

      await clickTestId(page, 'license-save-button');

      // Verify license added
      await waitForToast(page, 'License added successfully');
      await expect(getByTestId(page, 'client-licenses-list')).toContainText(
        mockDrivingLicense.dlNumber
      );
    }
  });

  test('should view client payment history', async ({ page }) => {
    // Navigate to first client's details
    const clientRows = page.locator('[data-testid^="client-row-"]');

    if ((await clientRows.count()) > 0) {
      await clientRows.first().click();
      await page.waitForURL(/\/clients\/[^\/]+$/);

      // Navigate to payments tab
      await clickTestId(page, 'client-payments-tab');

      // Check payment history elements
      await expect(getByTestId(page, 'client-payment-history-heading')).toBeVisible();

      // Verify payment table
      await expect(getByTestId(page, 'client-payments-table')).toBeVisible();
      await expect(getByTestId(page, 'payments-table-header-date')).toBeVisible();
      await expect(getByTestId(page, 'payments-table-header-amount')).toBeVisible();
      await expect(getByTestId(page, 'payments-table-header-method')).toBeVisible();
      await expect(getByTestId(page, 'payments-table-header-status')).toBeVisible();

      // Add new payment button should be visible
      await expect(getByTestId(page, 'client-add-payment-button')).toBeVisible();
    }
  });

  test('should add payment for client', async ({ page }) => {
    // Navigate to first client's details
    const clientRows = page.locator('tbody tr');

    if ((await clientRows.count()) > 0) {
      await clientRows.first().click();
      await page.waitForURL(/\/clients\/[^\/]+$/);

      // Navigate to payments tab
      await page.click('button:has-text("Payments")');

      // Add new payment
      await page.click('button:has-text("Add Payment")');

      await fillForm(page, {
        amount: '5000',
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: 'Partial payment for driving course',
      });

      await page.click('button:has-text("Save Payment")');

      // Verify payment added
      await waitForToast(page, 'Payment recorded successfully');
      await expect(page.locator('text=₹5,000')).toBeVisible();
    }
  });

  test('should view client training schedule', async ({ page }) => {
    // Navigate to first client's details
    const clientRows = page.locator('tbody tr');

    if ((await clientRows.count()) > 0) {
      await clientRows.first().click();
      await page.waitForURL(/\/clients\/[^\/]+$/);

      // Navigate to training tab
      await page.click('button:has-text("Training")');

      // Check training schedule elements
      await expect(page.locator('text=Training Schedule')).toBeVisible();
      await expect(page.locator('text=Assigned Vehicle')).toBeVisible();
      await expect(page.locator('text=Progress')).toBeVisible();
    }
  });

  test('should bulk select and perform actions', async ({ page }) => {
    // Select multiple clients
    const checkboxes = page.locator('input[type="checkbox"]').locator('visible=true');

    if ((await checkboxes.count()) > 2) {
      // Select first 3 checkboxes
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();
      await checkboxes.nth(2).check();

      // Verify bulk actions appear
      await expect(page.locator('text=3 selected')).toBeVisible();
      await expect(page.locator('button:has-text("Bulk Actions")')).toBeVisible();

      // Open bulk actions menu
      await page.click('button:has-text("Bulk Actions")');

      // Verify bulk action options
      await expect(page.locator('text=Export Selected')).toBeVisible();
      await expect(page.locator('text=Update Status')).toBeVisible();
      await expect(page.locator('text=Send SMS')).toBeVisible();
    }
  });

  test('should export client data', async ({ page }) => {
    // Click export button
    const exportButton = page.locator('button:has-text("Export")');

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Verify export options
      await expect(page.locator('text=Export as CSV')).toBeVisible();
      await expect(page.locator('text=Export as PDF')).toBeVisible();
      await expect(page.locator('text=Export as Excel')).toBeVisible();
    }
  });

  test('should handle client status updates', async ({ page }) => {
    // Navigate to first client's details
    const clientRows = page.locator('tbody tr');

    if ((await clientRows.count()) > 0) {
      await clientRows.first().click();
      await page.waitForURL(/\/clients\/[^\/]+$/);

      // Find status dropdown
      const statusDropdown = page.locator('select[name="status"], button:has-text("Status")');

      if (await statusDropdown.isVisible()) {
        await statusDropdown.click();

        // Select new status
        await page.click('text=Completed');

        // Confirm status change
        await page.click('button:has-text("Update Status")');

        // Verify success
        await waitForToast(page, 'Status updated successfully');
      }
    }
  });
});
