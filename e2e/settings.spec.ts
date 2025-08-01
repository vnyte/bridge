import { test, expect, fillForm, waitForToast } from './utils/test-helpers';

test.describe('Settings and Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display settings page with all sections', async ({ page }) => {
    // Check main settings sections
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();

    // Check settings navigation
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Organization')).toBeVisible();
    await expect(page.locator('text=Branch Settings')).toBeVisible();
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('text=Security')).toBeVisible();
    await expect(page.locator('text=Billing')).toBeVisible();
  });

  test('should update user profile', async ({ page }) => {
    // Navigate to profile section
    await page.click('text=Profile');

    // Update profile information
    await fillForm(page, {
      displayName: 'John Updated',
      phoneNumber: '9876543210',
      bio: 'Experienced driving school administrator',
    });

    // Upload profile picture (if available)
    const avatarUpload = page.locator('input[type="file"][name="avatar"]');
    if (await avatarUpload.isVisible()) {
      // In real test, would upload an image
      // await avatarUpload.setInputFiles('path/to/avatar.jpg');
    }

    // Save profile
    await page.click('button:has-text("Save Profile")');
    await waitForToast(page, 'Profile updated successfully');

    // Verify changes persisted
    await page.reload();
    await expect(page.locator('input[name="displayName"]')).toHaveValue('John Updated');
  });

  test('should manage organization settings', async ({ page }) => {
    // Navigate to organization settings
    await page.click('text=Organization');

    // Update organization details
    await fillForm(page, {
      organizationName: 'Premium Driving Academy',
      organizationEmail: 'contact@premiumdriving.com',
      organizationPhone: '1234567890',
      gstNumber: 'GST123456789',
      panNumber: 'ABCDE1234F',
    });

    // Upload logo
    const logoUpload = page.locator('input[type="file"][name="logo"]');
    if (await logoUpload.isVisible()) {
      // In real test, would upload a logo
      // await logoUpload.setInputFiles('path/to/logo.png');
    }

    // Save organization settings
    await page.click('button:has-text("Save Organization Settings")');
    await waitForToast(page, 'Organization settings updated');
  });

  test('should configure branch settings', async ({ page }) => {
    // Navigate to branch settings
    await page.click('text=Branch Settings');

    // Add new branch
    await page.click('button:has-text("Add Branch")');

    await fillForm(page, {
      branchName: 'North City Branch',
      branchCode: 'NCB001',
      branchAddress: '123 North Street',
      branchCity: 'Mumbai',
      branchState: 'Maharashtra',
      branchPincode: '400001',
      branchPhone: '2223334444',
      branchEmail: 'north@drivingschool.com',
    });

    // Set working hours
    await fillForm(page, {
      openTime: '08:00',
      closeTime: '20:00',
      workingDays: 'monday,tuesday,wednesday,thursday,friday,saturday',
    });

    await page.click('button:has-text("Add Branch")');
    await waitForToast(page, 'Branch added successfully');

    // Edit existing branch
    const branchRows = page.locator('[data-testid="branch-row"]');
    if ((await branchRows.count()) > 0) {
      await branchRows.first().locator('button[aria-label="Edit branch"]').click();

      await fillForm(page, {
        branchPhone: '2223334455',
      });

      await page.click('button:has-text("Update Branch")');
      await waitForToast(page, 'Branch updated successfully');
    }
  });

  test('should manage notification preferences', async ({ page }) => {
    // Navigate to notifications
    await page.click('text=Notifications');

    // Email notifications
    await expect(page.locator('text=Email Notifications')).toBeVisible();

    // Toggle notification preferences
    const toggles = {
      'New client registration': true,
      'Payment received': true,
      'Document expiry alerts': true,
      'Daily summary': false,
      'Marketing emails': false,
    };

    for (const [label, enabled] of Object.entries(toggles)) {
      const toggle = page.locator(`label:has-text("${label}") input[type="checkbox"]`);
      if (await toggle.isVisible()) {
        if (enabled) {
          await toggle.check();
        } else {
          await toggle.uncheck();
        }
      }
    }

    // SMS notifications
    await page.click('text=SMS Notifications');

    await fillForm(page, {
      smsProvider: 'twilio',
      smsApiKey: 'TWILIO_API_KEY',
      smsFromNumber: '+1234567890',
    });

    // Save notification settings
    await page.click('button:has-text("Save Notification Settings")');
    await waitForToast(page, 'Notification preferences updated');
  });

  test('should configure security settings', async ({ page }) => {
    // Navigate to security
    await page.click('text=Security');

    // Change password
    await page.click('button:has-text("Change Password")');

    await fillForm(page, {
      currentPassword: 'CurrentPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    await page.click('button:has-text("Update Password")');

    // Two-factor authentication
    const enable2FA = page.locator('button:has-text("Enable 2FA")');
    if (await enable2FA.isVisible()) {
      await enable2FA.click();

      // In real scenario, would scan QR code and enter verification code
      await expect(page.locator('text=Scan QR Code')).toBeVisible();

      // Cancel for now
      await page.click('button:has-text("Cancel")');
    }

    // Session management
    await expect(page.locator('text=Active Sessions')).toBeVisible();

    // Revoke other sessions
    const revokeButton = page.locator('button:has-text("Revoke All Other Sessions")');
    if (await revokeButton.isVisible()) {
      await revokeButton.click();
      await page.click('button:has-text("Confirm")');
      await waitForToast(page, 'Other sessions revoked');
    }
  });

  test('should manage billing and subscription', async ({ page }) => {
    // Navigate to billing
    await page.click('text=Billing');

    // Check current plan
    await expect(page.locator('text=Current Plan')).toBeVisible();
    await expect(page.locator('text=/Basic|Premium|Enterprise/i')).toBeVisible();

    // View billing history
    await page.click('text=Billing History');

    // Check invoice table
    await expect(page.locator('th:has-text("Invoice")')).toBeVisible();
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();

    // Update payment method
    await page.click('button:has-text("Update Payment Method")');

    await fillForm(page, {
      cardNumber: '4111111111111111',
      cardName: 'John Doe',
      expiryMonth: '12',
      expiryYear: '2025',
      cvv: '123',
    });

    await page.click('button:has-text("Save Card")');

    // Upgrade plan
    const upgradeButton = page.locator('button:has-text("Upgrade Plan")');
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();

      // Select new plan
      await page.click('[data-testid="plan-premium"]');
      await page.click('button:has-text("Continue")');

      // Confirm upgrade
      await expect(page.locator('text=Confirm Plan Upgrade')).toBeVisible();
      await page.click('button:has-text("Confirm Upgrade")');
    }
  });

  test('should configure system preferences', async ({ page }) => {
    // Look for system preferences section
    const systemPrefs = page.locator('text=System Preferences');

    if (await systemPrefs.isVisible()) {
      await systemPrefs.click();

      // Date and time format
      await fillForm(page, {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        timezone: 'Asia/Kolkata',
      });

      // Currency settings
      await fillForm(page, {
        currency: 'INR',
        currencyPosition: 'before',
      });

      // Language preferences
      await fillForm(page, {
        language: 'en',
        secondaryLanguage: 'hi',
      });

      await page.click('button:has-text("Save Preferences")');
      await waitForToast(page, 'System preferences updated');
    }
  });

  test('should manage integrations', async ({ page }) => {
    // Look for integrations section
    const integrations = page.locator('text=Integrations');

    if (await integrations.isVisible()) {
      await integrations.click();

      // SMS Gateway integration
      await page.click('[data-testid="integration-sms"]');
      await fillForm(page, {
        smsProvider: 'textlocal',
        apiKey: 'SMS_API_KEY',
        senderId: 'DRVING',
      });
      await page.click('button:has-text("Save Integration")');

      // Payment Gateway integration
      await page.click('[data-testid="integration-payment"]');
      await fillForm(page, {
        paymentProvider: 'razorpay',
        merchantId: 'MERCHANT_ID',
        apiKey: 'PAYMENT_API_KEY',
        webhookSecret: 'WEBHOOK_SECRET',
      });
      await page.click('button:has-text("Save Integration")');

      // Email service integration
      await page.click('[data-testid="integration-email"]');
      await fillForm(page, {
        emailProvider: 'sendgrid',
        apiKey: 'EMAIL_API_KEY',
        fromEmail: 'noreply@drivingschool.com',
        fromName: 'Driving School',
      });
      await page.click('button:has-text("Save Integration")');

      await waitForToast(page, 'Integrations updated');
    }
  });

  test('should export and import settings', async ({ page }) => {
    // Export settings
    const exportButton = page.locator('button:has-text("Export Settings")');

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Select export options
      await page.click('input[value="general"]');
      await page.click('input[value="notifications"]');
      await page.click('input[value="integrations"]');

      await page.click('button:has-text("Export")');

      // In real scenario, file would be downloaded
      await expect(page.locator('text=Settings exported successfully')).toBeVisible();
    }

    // Import settings
    const importButton = page.locator('button:has-text("Import Settings")');

    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"][accept=".json"]');
      if (await fileInput.isVisible()) {
        // In real test, would upload settings file
        // await fileInput.setInputFiles('path/to/settings.json');
      }

      // Cancel import for now
      await page.click('button:has-text("Cancel")');
    }
  });
});
