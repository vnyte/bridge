import { test, expect, ROUTES, fillForm, waitForToast } from './utils/test-helpers';
import { mockClient, mockLearningLicense } from './utils/mock-data';

test.describe('Client Admission Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real test, you'd need to authenticate first
    // For now, we'll just navigate to the admission page
    await page.goto(ROUTES.admission);
  });

  test('should display admission form steps', async ({ page }) => {
    // Check for step navigation
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await expect(page.locator('text=License Details')).toBeVisible();
    await expect(page.locator('text=Plan & Pricing')).toBeVisible();
    await expect(page.locator('text=Vehicle Assignment')).toBeVisible();
    await expect(page.locator('text=Review & Submit')).toBeVisible();
  });

  test('should navigate through admission steps', async ({ page }) => {
    // Step 1: Personal Information
    await expect(page.locator('h2:has-text("Personal Information")')).toBeVisible();

    // Fill personal info
    await fillForm(page, {
      firstName: mockClient.firstName,
      lastName: mockClient.lastName,
      email: mockClient.email,
      phoneNumber: mockClient.phoneNumber,
      dateOfBirth: mockClient.dateOfBirth,
      address: mockClient.address,
      city: mockClient.city,
      state: mockClient.state,
      postalCode: mockClient.postalCode,
      emergencyContact: mockClient.emergencyContact,
      emergencyContactPhone: mockClient.emergencyContactPhone,
    });

    // Click Next
    await page.click('button:has-text("Next")');

    // Step 2: License Details
    await expect(page.locator('h2:has-text("License Details")')).toBeVisible();

    // Add Learning License
    await page.click('button:has-text("Add Learning License")');
    await fillForm(page, {
      llNumber: mockLearningLicense.llNumber,
      issueDate: mockLearningLicense.issueDate,
      expiryDate: mockLearningLicense.expiryDate,
      rtoOffice: mockLearningLicense.rtoOffice,
    });

    // Select vehicle classes
    for (const vehicleClass of mockLearningLicense.vehicleClasses) {
      await page.click(`input[value="${vehicleClass}"]`);
    }

    await page.click('button:has-text("Next")');

    // Step 3: Plan & Pricing
    await expect(page.locator('h2:has-text("Plan & Pricing")')).toBeVisible();

    // Select a plan
    const plans = page.locator('[data-testid="plan-card"]');
    if ((await plans.count()) > 0) {
      await plans.first().click();
    }

    // Select payment method
    await page.click('input[value="cash"]');

    await page.click('button:has-text("Next")');

    // Step 4: Vehicle Assignment
    await expect(page.locator('h2:has-text("Vehicle Assignment")')).toBeVisible();

    // Select available vehicles
    const vehicles = page.locator('[data-testid="vehicle-card"]');
    if ((await vehicles.count()) > 0) {
      await vehicles.first().click();
    }

    await page.click('button:has-text("Next")');

    // Step 5: Review & Submit
    await expect(page.locator('h2:has-text("Review & Submit")')).toBeVisible();

    // Verify summary shows entered data
    await expect(page.locator(`text=${mockClient.firstName}`)).toBeVisible();
    await expect(page.locator(`text=${mockClient.email}`)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")');

    // Check for validation errors
    await expect(page.locator('text=/required|fill|enter/i')).toBeVisible();
  });

  test('should allow going back to previous steps', async ({ page }) => {
    // Fill first step
    await fillForm(page, {
      firstName: mockClient.firstName,
      lastName: mockClient.lastName,
      email: mockClient.email,
      phoneNumber: mockClient.phoneNumber,
    });

    // Go to next step
    await page.click('button:has-text("Next")');

    // Verify on step 2
    await expect(page.locator('h2:has-text("License Details")')).toBeVisible();

    // Go back
    await page.click('button:has-text("Previous")');

    // Verify back on step 1 with data preserved
    await expect(page.locator('h2:has-text("Personal Information")')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toHaveValue(mockClient.firstName);
  });

  test('should handle payment options', async ({ page }) => {
    // Navigate to payment step (Step 3)
    // Note: In real test, would fill previous steps first

    // Check payment method options
    await expect(page.locator('input[value="cash"]')).toBeVisible();
    await expect(page.locator('input[value="online"]')).toBeVisible();
    await expect(page.locator('input[value="cheque"]')).toBeVisible();

    // Check installment options
    await expect(page.locator('text=Pay in Full')).toBeVisible();
    await expect(page.locator('text=2 Installments')).toBeVisible();
    await expect(page.locator('text=Pay Later')).toBeVisible();
  });

  test.skip('should submit admission successfully', async ({ page }) => {
    // This test would require full form filling and API mocking
    // Navigate through all steps and submit

    // Fill all steps...
    // Submit form
    await page.click('button:has-text("Submit")');

    // Check for success message
    await waitForToast(page, 'successfully');

    // Verify redirect to clients list
    await expect(page).toHaveURL(ROUTES.clients);
  });
});
