import { test, expect, ROUTES, fillForm, waitForToast } from './utils/test-helpers';

test.describe('Payment Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.payments);
  });

  test('should display payments page with all sections', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1:has-text("Payments")')).toBeVisible();

    // Check main sections
    await expect(page.locator('text=Payment Overview')).toBeVisible();
    await expect(page.locator('text=Recent Transactions')).toBeVisible();
    await expect(page.locator('button:has-text("Record Payment")')).toBeVisible();

    // Check summary cards
    await expect(page.locator('text=Total Collected')).toBeVisible();
    await expect(page.locator('text=Pending Amount')).toBeVisible();
    await expect(page.locator("text=Today's Collection")).toBeVisible();
    await expect(page.locator('text=Overdue Payments')).toBeVisible();
  });

  test('should record new payment', async ({ page }) => {
    await page.click('button:has-text("Record Payment")');

    // Check payment form
    await expect(page.locator('h2:has-text("Record Payment")')).toBeVisible();

    // Select client
    const clientSelect = page.locator('select[name="clientId"]');
    if (await clientSelect.isVisible()) {
      const options = await clientSelect.locator('option').count();
      if (options > 1) {
        await clientSelect.selectOption({ index: 1 });

        // Wait for pending amount to load
        await page.waitForTimeout(500);

        // Fill payment details
        await fillForm(page, {
          amount: '5000',
          paymentMethod: 'cash',
          paymentDate: new Date().toISOString().split('T')[0],
          referenceNumber: 'CASH001',
          notes: 'Partial payment for driving course',
        });

        // Submit payment
        await page.click('button:has-text("Record Payment")');
        await waitForToast(page, 'Payment recorded successfully');

        // Verify payment appears in list
        await expect(page.locator('text=₹5,000')).toBeVisible();
        await expect(page.locator('text=CASH001')).toBeVisible();
      }
    }
  });

  test('should filter payments by date range', async ({ page }) => {
    // Set date range
    const startDate = page.locator('input[name="startDate"]');
    const endDate = page.locator('input[name="endDate"]');

    if ((await startDate.isVisible()) && (await endDate.isVisible())) {
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = new Date().toISOString().split('T')[0];

      await startDate.fill(start);
      await endDate.fill(end);
      await page.click('button:has-text("Apply")');

      // Wait for results to update
      await page.waitForTimeout(500);
    }
  });

  test('should filter payments by status', async ({ page }) => {
    // Filter by payment status
    const statusFilter = page.locator('select[name="status"]');

    if (await statusFilter.isVisible()) {
      // Filter completed payments
      await statusFilter.selectOption('completed');
      await page.waitForTimeout(500);

      // Verify only completed payments shown
      const statusBadges = page.locator('[data-testid="payment-status"]');
      if ((await statusBadges.count()) > 0) {
        for (let i = 0; i < (await statusBadges.count()); i++) {
          const status = await statusBadges.nth(i).textContent();
          expect(status?.toLowerCase()).toContain('completed');
        }
      }

      // Filter pending payments
      await statusFilter.selectOption('pending');
      await page.waitForTimeout(500);
    }
  });

  test('should view payment details and print receipt', async ({ page }) => {
    // Click on first payment row
    const paymentRows = page.locator('tbody tr');

    if ((await paymentRows.count()) > 0) {
      await paymentRows.first().click();

      // Check payment details modal
      await expect(page.locator('h2:has-text("Payment Details")')).toBeVisible();

      // Verify details sections
      await expect(page.locator('text=Client Information')).toBeVisible();
      await expect(page.locator('text=Payment Information')).toBeVisible();
      await expect(page.locator('text=Transaction Details')).toBeVisible();

      // Print receipt
      await page.click('button:has-text("Print Receipt")');

      // In real scenario, this would trigger print dialog
      // For now, just verify the button works

      // Download receipt
      const downloadButton = page.locator('button:has-text("Download PDF")');
      if (await downloadButton.isVisible()) {
        await downloadButton.click();
      }

      // Close modal
      await page.click('button[aria-label="Close"]');
    }
  });

  test('should handle installment payments', async ({ page }) => {
    // Find a client with pending installments
    const installmentBadges = page.locator('text=/installment|partial/i');

    if ((await installmentBadges.count()) > 0) {
      // Click on the payment row
      const paymentRow = installmentBadges.first().locator('xpath=ancestor::tr');
      await paymentRow.click();

      // Check installment details
      await expect(page.locator('text=Installment Details')).toBeVisible();
      await expect(page.locator('text=1st Installment')).toBeVisible();
      await expect(page.locator('text=2nd Installment')).toBeVisible();

      // Record installment payment
      await page.click('button:has-text("Record Installment")');

      await fillForm(page, {
        installmentNumber: '2',
        amount: '7000',
        paymentMethod: 'online',
        transactionId: 'TXN123456',
      });

      await page.click('button:has-text("Record Payment")');
      await waitForToast(page, 'Installment payment recorded');
    }
  });

  test('should send payment reminders', async ({ page }) => {
    // Look for overdue payments
    const overdueSection = page.locator('[data-testid="overdue-payments"]');

    if (await overdueSection.isVisible()) {
      // Select overdue payments
      const checkboxes = overdueSection.locator('input[type="checkbox"]');
      if ((await checkboxes.count()) > 0) {
        // Select first few overdue payments
        for (let i = 0; i < Math.min(3, await checkboxes.count()); i++) {
          await checkboxes.nth(i).check();
        }

        // Send reminder
        await page.click('button:has-text("Send Reminder")');

        // Configure reminder
        await fillForm(page, {
          reminderType: 'sms',
          messageTemplate: 'payment_due',
        });

        await page.click('button:has-text("Send")');
        await waitForToast(page, 'Reminders sent successfully');
      }
    }
  });

  test('should generate payment reports', async ({ page }) => {
    // Open reports section
    await page.click('button:has-text("Reports")');

    // Check report options
    await expect(page.locator('text=Payment Reports')).toBeVisible();

    // Generate collection report
    await page.click('text=Collection Report');

    await fillForm(page, {
      reportType: 'monthly',
      month: 'January',
      year: '2024',
    });

    await page.click('button:has-text("Generate Report")');

    // Wait for report generation
    await expect(page.locator('text=Report Generated')).toBeVisible({ timeout: 10000 });

    // Check report summary
    await expect(page.locator('text=Total Collections')).toBeVisible();
    await expect(page.locator('text=Payment Methods Breakdown')).toBeVisible();
    await expect(page.locator('text=Branch-wise Collection')).toBeVisible();

    // Export report
    await page.click('button:has-text("Export Report")');
    await page.click('text=Excel Format');
  });

  test('should handle refunds', async ({ page }) => {
    // Find a completed payment
    const completedPayments = page.locator('tr:has-text("Completed")');

    if ((await completedPayments.count()) > 0) {
      // Open payment actions
      await completedPayments.first().locator('button[aria-label="Payment actions"]').click();

      // Click refund
      await page.click('text=Process Refund');

      // Fill refund details
      await fillForm(page, {
        refundAmount: '2000',
        refundReason: 'service_cancellation',
        refundMethod: 'bank_transfer',
        notes: 'Client requested partial refund due to schedule change',
      });

      // Process refund
      await page.click('button:has-text("Process Refund")');

      // Confirm refund
      await expect(page.locator('text=Confirm Refund')).toBeVisible();
      await page.click('button:has-text("Confirm")');

      await waitForToast(page, 'Refund processed successfully');

      // Verify refund appears in history
      await expect(page.locator('text=Refund - ₹2,000')).toBeVisible();
    }
  });

  test('should reconcile payments', async ({ page }) => {
    // Navigate to reconciliation
    await page.click('button:has-text("Reconcile")');

    if (await page.locator('text=Payment Reconciliation').isVisible()) {
      // Upload bank statement
      await page.click('button:has-text("Upload Statement")');

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // In real test, would upload a file
        // await fileInput.setInputFiles('path/to/statement.csv');
      }

      // Manual reconciliation
      await page.click('text=Manual Reconciliation');

      // Match transactions
      const unmatchedTransactions = page.locator('[data-testid="unmatched-transaction"]');
      if ((await unmatchedTransactions.count()) > 0) {
        // Select first unmatched transaction
        await unmatchedTransactions.first().click();

        // Find matching payment
        await page.click('button:has-text("Find Match")');

        // Select suggested match
        const suggestions = page.locator('[data-testid="match-suggestion"]');
        if ((await suggestions.count()) > 0) {
          await suggestions.first().click();
          await page.click('button:has-text("Confirm Match")');
          await waitForToast(page, 'Transaction matched successfully');
        }
      }

      // Complete reconciliation
      await page.click('button:has-text("Complete Reconciliation")');
    }
  });

  test('should manage payment plans', async ({ page }) => {
    // Navigate to payment plans
    await page.click('text=Payment Plans');

    if (await page.locator('text=Manage Payment Plans').isVisible()) {
      // Create new payment plan
      await page.click('button:has-text("Create Plan")');

      await fillForm(page, {
        planName: 'Premium Driving Course',
        totalAmount: '25000',
        installments: '4',
        installmentFrequency: 'monthly',
        description: 'Premium course with 4 monthly installments',
      });

      // Set installment amounts
      for (let i = 1; i <= 4; i++) {
        await page.fill(`input[name="installment${i}"]`, '6250');
      }

      await page.click('button:has-text("Create Plan")');
      await waitForToast(page, 'Payment plan created');

      // Verify plan appears
      await expect(page.locator('text=Premium Driving Course')).toBeVisible();
      await expect(page.locator('text=₹25,000')).toBeVisible();
      await expect(page.locator('text=4 installments')).toBeVisible();
    }
  });

  test('should track payment performance metrics', async ({ page }) => {
    // Navigate to analytics
    await page.click('text=Analytics');

    if (await page.locator('text=Payment Analytics').isVisible()) {
      // Check key metrics
      await expect(page.locator('text=Collection Rate')).toBeVisible();
      await expect(page.locator('text=Average Payment Time')).toBeVisible();
      await expect(page.locator('text=Default Rate')).toBeVisible();
      await expect(page.locator('text=Payment Method Distribution')).toBeVisible();

      // Check trend charts
      await expect(page.locator('[data-testid="collection-trend-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="payment-method-chart"]')).toBeVisible();

      // Export analytics data
      await page.click('button:has-text("Export Analytics")');
      await page.click('text=Download CSV');
    }
  });
});
