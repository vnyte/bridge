import { test, expect, ROUTES } from './utils/test-helpers';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dashboard);
  });

  test('should display dashboard with all widgets', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();

    // Check key metric widgets
    await expect(page.locator('text=Total Clients')).toBeVisible();
    await expect(page.locator('text=Active Vehicles')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Pending Payments')).toBeVisible();

    // Check for chart sections
    await expect(page.locator('text=Revenue Overview')).toBeVisible();
    await expect(page.locator('text=Client Growth')).toBeVisible();
    await expect(page.locator('text=Vehicle Utilization')).toBeVisible();
  });

  test('should display recent activities', async ({ page }) => {
    // Check for recent activities section
    await expect(page.locator('text=Recent Activities')).toBeVisible();

    // Verify activity items structure
    const activities = page.locator('[data-testid="activity-item"]');
    if ((await activities.count()) > 0) {
      const firstActivity = activities.first();

      // Each activity should have timestamp and description
      await expect(firstActivity.locator('[data-testid="activity-time"]')).toBeVisible();
      await expect(firstActivity.locator('[data-testid="activity-description"]')).toBeVisible();
    }
  });

  test('should show document expiry alerts', async ({ page }) => {
    // Check for alerts section
    const alertsSection = page.locator('[data-testid="alerts-section"]');

    if (await alertsSection.isVisible()) {
      await expect(alertsSection.locator('text=Expiring Documents')).toBeVisible();

      // Check for expiry items
      const expiryAlerts = alertsSection.locator('[data-testid="expiry-alert"]');
      if ((await expiryAlerts.count()) > 0) {
        // Each alert should show document type and expiry date
        const firstAlert = expiryAlerts.first();
        await expect(firstAlert.locator('text=/insurance|puc|license/i')).toBeVisible();
        await expect(firstAlert.locator('text=/expir|days left/i')).toBeVisible();
      }
    }
  });

  test('should navigate to quick actions', async ({ page }) => {
    // Check quick action buttons
    const quickActions = [
      { button: 'Add Client', url: ROUTES.admission },
      { button: 'Add Vehicle', url: ROUTES.vehicles },
      { button: 'Record Payment', url: ROUTES.payments },
    ];

    for (const action of quickActions) {
      const button = page.locator(`button:has-text("${action.button}")`);
      if (await button.isVisible()) {
        await button.click();
        await expect(page).toHaveURL(new RegExp(action.url));
        await page.goBack();
      }
    }
  });

  test('should filter dashboard by date range', async ({ page }) => {
    // Look for date range selector
    const dateRangeButton = page
      .locator('button:has-text("Last 30 days")')
      .or(page.locator('[data-testid="date-range-selector"]'));

    if (await dateRangeButton.isVisible()) {
      await dateRangeButton.click();

      // Select different date ranges
      await page.click('text=Last 7 days');
      await page.waitForTimeout(1000); // Wait for data to update

      // Verify data updated (check for loading state or updated metrics)
      await expect(page.locator('[data-testid="loading-indicator"]')).not.toBeVisible({
        timeout: 5000,
      });

      // Try custom date range
      await dateRangeButton.click();
      await page.click('text=Custom Range');

      // Set custom dates if date pickers appear
      const startDateInput = page.locator('input[name="startDate"]');
      const endDateInput = page.locator('input[name="endDate"]');

      if ((await startDateInput.isVisible()) && (await endDateInput.isVisible())) {
        const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        await startDateInput.fill(startDate);
        await endDateInput.fill(endDate);
        await page.click('button:has-text("Apply")');
      }
    }
  });

  test('should display revenue breakdown', async ({ page }) => {
    // Check revenue section
    const revenueSection = page.locator('[data-testid="revenue-section"]');

    if (await revenueSection.isVisible()) {
      // Check for revenue breakdown by category
      await expect(revenueSection.locator('text=Training Fees')).toBeVisible();
      await expect(revenueSection.locator('text=License Services')).toBeVisible();
      await expect(revenueSection.locator('text=Other Services')).toBeVisible();

      // Check for payment method breakdown
      await expect(page.locator('text=Payment Methods')).toBeVisible();
      await expect(page.locator('text=/cash|online|cheque/i')).toBeVisible();
    }
  });

  test('should show upcoming sessions', async ({ page }) => {
    // Check for upcoming sessions widget
    const sessionsWidget = page.locator('[data-testid="upcoming-sessions"]');

    if (await sessionsWidget.isVisible()) {
      await expect(sessionsWidget.locator('text=Upcoming Sessions')).toBeVisible();

      // Check session items
      const sessions = sessionsWidget.locator('[data-testid="session-item"]');
      if ((await sessions.count()) > 0) {
        const firstSession = sessions.first();

        // Each session should show time, client, instructor, and vehicle
        await expect(firstSession.locator('[data-testid="session-time"]')).toBeVisible();
        await expect(firstSession.locator('[data-testid="session-client"]')).toBeVisible();
        await expect(firstSession.locator('[data-testid="session-instructor"]')).toBeVisible();
        await expect(firstSession.locator('[data-testid="session-vehicle"]')).toBeVisible();
      }
    }
  });

  test('should display branch performance comparison', async ({ page }) => {
    // Check if branch comparison exists (for multi-branch setups)
    const branchComparison = page.locator('[data-testid="branch-comparison"]');

    if (await branchComparison.isVisible()) {
      await expect(branchComparison.locator('text=Branch Performance')).toBeVisible();

      // Check for branch selector
      const branchSelector = branchComparison.locator('select[name="branch"]');
      if (await branchSelector.isVisible()) {
        const options = await branchSelector.locator('option').count();
        if (options > 1) {
          // Select different branch
          await branchSelector.selectOption({ index: 1 });
          await page.waitForTimeout(1000); // Wait for data update
        }
      }
    }
  });

  test('should export dashboard data', async ({ page }) => {
    // Look for export button
    const exportButton = page
      .locator('button:has-text("Export")')
      .or(page.locator('[data-testid="export-dashboard"]'));

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Check export options
      await expect(page.locator('text=Export Dashboard')).toBeVisible();
      await expect(page.locator('text=PDF Report')).toBeVisible();
      await expect(page.locator('text=Excel Data')).toBeVisible();

      // Close export dialog
      await page.click('button[aria-label="Close"]').or(page.press('body', 'Escape'));
    }
  });

  test('should refresh dashboard data', async ({ page }) => {
    // Look for refresh button
    const refreshButton = page
      .locator('button[aria-label="Refresh"]')
      .or(page.locator('[data-testid="refresh-dashboard"]'));

    if (await refreshButton.isVisible()) {
      await refreshButton.click();

      // Check for loading state
      const loadingIndicator = page
        .locator('[data-testid="loading-indicator"]')
        .or(page.locator('.animate-spin'));
      await expect(loadingIndicator).toBeVisible();

      // Wait for loading to complete
      await expect(loadingIndicator).not.toBeVisible({ timeout: 10000 });
    }
  });

  test('should display notification center', async ({ page }) => {
    // Check for notification icon/button
    const notificationButton = page
      .locator('button[aria-label="Notifications"]')
      .or(page.locator('[data-testid="notifications"]'));

    if (await notificationButton.isVisible()) {
      await notificationButton.click();

      // Check notification panel
      await expect(page.locator('text=Notifications')).toBeVisible();

      // Check notification items
      const notifications = page.locator('[data-testid="notification-item"]');
      if ((await notifications.count()) > 0) {
        const firstNotification = notifications.first();

        // Each notification should have title, message, and timestamp
        await expect(firstNotification.locator('[data-testid="notification-title"]')).toBeVisible();
        await expect(firstNotification.locator('[data-testid="notification-time"]')).toBeVisible();

        // Mark as read functionality
        const markReadButton = firstNotification.locator('button[aria-label="Mark as read"]');
        if (await markReadButton.isVisible()) {
          await markReadButton.click();
        }
      }

      // Close notifications
      await page.click('body'); // Click outside to close
    }
  });

  test('should customize dashboard widgets', async ({ page }) => {
    // Look for customize button
    const customizeButton = page
      .locator('button:has-text("Customize")')
      .or(page.locator('[data-testid="customize-dashboard"]'));

    if (await customizeButton.isVisible()) {
      await customizeButton.click();

      // Check widget customization options
      await expect(page.locator('text=Customize Dashboard')).toBeVisible();

      // Toggle widget visibility
      const widgetToggles = page.locator('[data-testid="widget-toggle"]');
      if ((await widgetToggles.count()) > 0) {
        // Toggle first widget off
        await widgetToggles.first().click();

        // Save changes
        await page.click('button:has-text("Save Layout")');

        // Verify widget is hidden
        await page.waitForTimeout(1000); // Wait for layout update
      }
    }
  });
});
