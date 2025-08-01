import { test, expect, ROUTES, getByTestId, clickTestId, fillTestId } from './utils/test-helpers';
import { mockClient, mockLearningLicense, mockPayment } from './utils/mock-data';

test.describe('Full Application Flow', () => {
  // This test suite demonstrates the complete user journey

  test('complete admission to client management flow', async ({ page }) => {
    // Start at admission page
    await page.goto(ROUTES.admission);

    // Step 1: Personal Information
    await expect(getByTestId(page, 'admission-step-1')).toBeVisible();
    await expect(getByTestId(page, 'admission-personal-info-heading')).toBeVisible();

    // Fill personal information using test IDs
    await fillTestId(page, 'admission-firstName-input', mockClient.firstName);
    await fillTestId(page, 'admission-lastName-input', mockClient.lastName);
    await fillTestId(page, 'admission-email-input', mockClient.email);
    await fillTestId(page, 'admission-phoneNumber-input', mockClient.phoneNumber);
    await fillTestId(page, 'admission-dateOfBirth-input', mockClient.dateOfBirth);
    await fillTestId(page, 'admission-address-input', mockClient.address);
    await fillTestId(page, 'admission-city-input', mockClient.city);
    await fillTestId(page, 'admission-state-input', mockClient.state);
    await fillTestId(page, 'admission-postalCode-input', mockClient.postalCode);
    await fillTestId(page, 'admission-emergencyContact-input', mockClient.emergencyContact);
    await fillTestId(
      page,
      'admission-emergencyContactPhone-input',
      mockClient.emergencyContactPhone
    );

    await clickTestId(page, 'admission-next-button');

    // Step 2: License Details
    await expect(getByTestId(page, 'admission-step-2')).toBeVisible();
    await expect(getByTestId(page, 'admission-license-details-heading')).toBeVisible();

    await clickTestId(page, 'admission-add-learning-license-button');

    // Fill learning license details
    await fillTestId(page, 'license-llNumber-input', mockLearningLicense.llNumber);
    await fillTestId(page, 'license-issueDate-input', mockLearningLicense.issueDate);
    await fillTestId(page, 'license-expiryDate-input', mockLearningLicense.expiryDate);
    await fillTestId(page, 'license-rtoOffice-input', mockLearningLicense.rtoOffice);

    // Select vehicle classes using test IDs
    for (const vehicleClass of mockLearningLicense.vehicleClasses) {
      await getByTestId(page, `license-vehicleClass-${vehicleClass}-checkbox`).check();
    }

    await clickTestId(page, 'admission-next-button');

    // Step 3: Plan & Pricing
    await expect(getByTestId(page, 'admission-step-3')).toBeVisible();
    await expect(getByTestId(page, 'admission-plan-pricing-heading')).toBeVisible();

    // Select first available plan
    const planCards = page.locator('[data-testid^="plan-card-"]');
    await expect(planCards.first()).toBeVisible();
    await planCards.first().click();

    // Select payment method and installment option
    await getByTestId(page, 'payment-method-cash-radio').check();
    await getByTestId(page, 'payment-installment-2-radio').check();

    // Fill installment amounts if visible
    const firstInstallmentInput = getByTestId(page, 'payment-firstInstallment-input');

    if (await firstInstallmentInput.isVisible()) {
      await fillTestId(
        page,
        'payment-firstInstallment-input',
        String(mockPayment.firstInstallment)
      );
      await fillTestId(
        page,
        'payment-secondInstallment-input',
        String(mockPayment.secondInstallment)
      );
    }

    await clickTestId(page, 'admission-next-button');

    // Step 4: Vehicle Assignment
    await expect(getByTestId(page, 'admission-step-4')).toBeVisible();
    await expect(getByTestId(page, 'admission-vehicle-assignment-heading')).toBeVisible();

    // Select first available vehicle
    const vehicleCards = page.locator('[data-testid^="vehicle-card-"]');
    await expect(vehicleCards.first()).toBeVisible();
    await vehicleCards.first().click();

    // Set training dates if required
    const startDateInput = getByTestId(page, 'training-startDate-input');
    if (await startDateInput.isVisible()) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      await fillTestId(page, 'training-startDate-input', tomorrow.toISOString().split('T')[0]);
    }

    await clickTestId(page, 'admission-next-button');

    // Step 5: Review & Submit
    await expect(getByTestId(page, 'admission-step-5')).toBeVisible();
    await expect(getByTestId(page, 'admission-review-submit-heading')).toBeVisible();

    // Verify summary using test IDs
    await expect(getByTestId(page, 'review-client-name')).toHaveText(
      `${mockClient.firstName} ${mockClient.lastName}`
    );
    await expect(getByTestId(page, 'review-client-email')).toHaveText(mockClient.email);
    await expect(getByTestId(page, 'review-license-number')).toHaveText(
      mockLearningLicense.llNumber
    );

    // Submit the form
    await clickTestId(page, 'admission-submit-button');

    // Wait for success and redirect
    await waitForToast(page, 'successfully');
    await page.waitForURL('**/clients');

    // Verify client appears in the list using test IDs
    await expect(
      getByTestId(page, `client-row-${mockClient.email.replace('@', '-').replace('.', '-')}`)
    ).toBeVisible();
    await expect(getByTestId(page, 'clients-table')).toContainText(mockClient.firstName);
    await expect(getByTestId(page, 'clients-table')).toContainText(mockClient.email);
    await expect(getByTestId(page, 'clients-table')).toContainText(mockClient.phoneNumber);
  });
});
