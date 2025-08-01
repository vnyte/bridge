import {
  test,
  expect,
  ROUTES,
  getByTestId,
  clickTestId,
  fillTestId,
  waitForToast,
} from './utils/test-helpers';
import { mockVehicle } from './utils/mock-data';

test.describe('Comprehensive Vehicle Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.vehicles);
  });

  test('should display vehicles page with all features', async ({ page }) => {
    // Check page title and main elements
    await expect(getByTestId(page, 'vehicles-page')).toBeVisible();
    await expect(getByTestId(page, 'vehicles-page-heading')).toBeVisible();
    await expect(getByTestId(page, 'vehicles-add-button')).toBeVisible();
    await expect(getByTestId(page, 'vehicles-search-input')).toBeVisible();

    // Check filter options
    await expect(getByTestId(page, 'vehicles-type-filter')).toBeVisible();
    await expect(getByTestId(page, 'vehicles-status-filter')).toBeVisible();
  });

  test('complete vehicle CRUD operations', async ({ page }) => {
    // CREATE: Add new vehicle
    await clickTestId(page, 'vehicles-add-button');
    await expect(getByTestId(page, 'vehicle-add-modal')).toBeVisible();
    await expect(getByTestId(page, 'vehicle-add-modal-heading')).toBeVisible();

    // Fill all vehicle details
    await fillTestId(page, 'vehicle-registrationNumber-input', mockVehicle.registrationNumber);
    await fillTestId(page, 'vehicle-make-input', mockVehicle.make);
    await fillTestId(page, 'vehicle-model-input', mockVehicle.model);
    await fillTestId(page, 'vehicle-year-input', mockVehicle.year);
    await getByTestId(page, 'vehicle-type-select').selectOption(mockVehicle.vehicleType);
    await getByTestId(page, 'vehicle-fuelType-select').selectOption(mockVehicle.fuelType);
    await getByTestId(page, 'vehicle-transmissionType-select').selectOption(
      mockVehicle.transmissionType
    );
    await fillTestId(page, 'vehicle-insuranceNumber-input', mockVehicle.insuranceNumber);
    await fillTestId(page, 'vehicle-insuranceExpiry-input', mockVehicle.insuranceExpiry);
    await fillTestId(page, 'vehicle-pucNumber-input', mockVehicle.pucNumber);
    await fillTestId(page, 'vehicle-pucExpiry-input', mockVehicle.pucExpiry);
    await fillTestId(page, 'vehicle-registrationExpiry-input', mockVehicle.registrationExpiry);

    // Add maintenance details if available
    const maintenanceSection = getByTestId(page, 'vehicle-maintenance-section');
    if (await maintenanceSection.isVisible()) {
      await fillTestId(page, 'vehicle-lastServiceDate-input', '2024-01-01');
      await fillTestId(page, 'vehicle-nextServiceDue-input', '2024-04-01');
      await fillTestId(page, 'vehicle-odometerReading-input', '25000');
    }

    await clickTestId(page, 'vehicle-save-button');
    await waitForToast(page, 'Vehicle added successfully');

    // Verify vehicle appears in list
    await expect(getByTestId(page, `vehicle-row-${mockVehicle.registrationNumber}`)).toBeVisible();

    // READ: View vehicle details
    await clickTestId(page, `vehicle-row-${mockVehicle.registrationNumber}`);
    await expect(getByTestId(page, 'vehicle-details-modal')).toBeVisible();

    // Verify all details are shown
    await expect(getByTestId(page, 'vehicle-make-model-display')).toHaveText(
      `${mockVehicle.make} ${mockVehicle.model}`
    );
    await expect(getByTestId(page, 'vehicle-type-display')).toHaveText(mockVehicle.vehicleType);
    await expect(getByTestId(page, 'vehicle-insurance-section')).toBeVisible();
    await expect(getByTestId(page, 'vehicle-puc-section')).toBeVisible();

    // Close details
    await clickTestId(page, 'modal-close-button');

    // UPDATE: Edit vehicle
    await clickTestId(page, `vehicle-edit-button-${mockVehicle.registrationNumber}`);

    await fillTestId(page, 'vehicle-odometerReading-input', '26500');
    await fillTestId(page, 'vehicle-notes-input', 'Regular maintenance completed');

    await clickTestId(page, 'vehicle-update-button');
    await waitForToast(page, 'Vehicle updated successfully');

    // DELETE: Remove vehicle (cancel first)
    await clickTestId(page, `vehicle-delete-button-${mockVehicle.registrationNumber}`);

    await expect(getByTestId(page, 'confirm-delete-modal')).toBeVisible();
    await expect(getByTestId(page, 'confirm-delete-message')).toHaveText(
      'Are you sure you want to delete this vehicle?'
    );
    await clickTestId(page, 'confirm-delete-cancel-button');

    // Verify vehicle still exists
    await expect(getByTestId(page, `vehicle-row-${mockVehicle.registrationNumber}`)).toBeVisible();
  });

  test('should manage vehicle assignments', async ({ page }) => {
    const vehicleRow = page.locator('tbody tr').first();

    if (await vehicleRow.isVisible()) {
      // Click on vehicle to view details
      await vehicleRow.click();

      // Navigate to assignments tab
      await page.click('button:has-text("Assignments")');

      // Check assignment history
      await expect(page.locator('text=Assignment History')).toBeVisible();

      // Add new assignment button
      await expect(page.locator('button:has-text("Assign to Client")')).toBeVisible();

      // Click to assign
      await page.click('button:has-text("Assign to Client")');

      // Select client from dropdown
      const clientSelect = page.locator('select[name="clientId"]');
      if (await clientSelect.isVisible()) {
        const options = await clientSelect.locator('option').count();
        if (options > 1) {
          await clientSelect.selectOption({ index: 1 });
        }
      }

      // Set assignment dates
      await fillForm(page, {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      await page.click('button:has-text("Assign")');
      await waitForToast(page, 'Vehicle assigned successfully');
    }
  });

  test('should track vehicle maintenance', async ({ page }) => {
    const vehicleRow = page.locator('tbody tr').first();

    if (await vehicleRow.isVisible()) {
      await vehicleRow.click();

      // Navigate to maintenance tab
      await page.click('button:has-text("Maintenance")');

      // Add maintenance record
      await page.click('button:has-text("Add Maintenance Record")');

      await fillForm(page, {
        maintenanceType: 'service',
        serviceDate: new Date().toISOString().split('T')[0],
        serviceCost: '5000',
        serviceProvider: 'Authorized Service Center',
        description: 'Regular 10,000 km service',
        nextServiceDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      await page.click('button:has-text("Save Record")');
      await waitForToast(page, 'Maintenance record added');

      // Verify record appears
      await expect(page.locator('text=Regular 10,000 km service')).toBeVisible();
    }
  });

  test('should handle document expiry alerts', async ({ page }) => {
    // Look for vehicles with expiring documents
    const expiryIndicators = page.locator('.text-orange-500, .text-red-500');

    if ((await expiryIndicators.count()) > 0) {
      // Click on a vehicle with expiring document
      const vehicleWithExpiry = expiryIndicators.first().locator('xpath=ancestor::tr');
      await vehicleWithExpiry.click();

      // Navigate to documents tab
      await page.click('button:has-text("Documents")');

      // Check for expiry warnings
      await expect(page.locator('text=/expir|renew/i')).toBeVisible();

      // Update document
      await page.click('button:has-text("Update Document")');

      const documentType = page.locator('select[name="documentType"]');
      if (await documentType.isVisible()) {
        await documentType.selectOption('insurance');

        await fillForm(page, {
          documentNumber: 'INS2024567890',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });

        await page.click('button:has-text("Update")');
        await waitForToast(page, 'Document updated successfully');
      }
    }
  });

  test('should filter vehicles by multiple criteria', async ({ page }) => {
    // Filter by vehicle type
    const typeFilter = page.locator('select[name="vehicleType"]');
    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption('LMV');
      await page.waitForTimeout(500); // Wait for filter to apply
    }

    // Filter by status
    const statusFilter = page.locator('select[name="status"]');
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('active');
      await page.waitForTimeout(500);
    }

    // Search by registration
    await page.fill('input[placeholder*="Search"]', 'MH');
    await page.press('input[placeholder*="Search"]', 'Enter');

    // Verify filtered results
    const rows = page.locator('tbody tr');
    const count = await rows.count();

    if (count > 0) {
      // Verify all visible vehicles match criteria
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const regNumber = await row.locator('td').first().textContent();
        expect(regNumber).toContain('MH');
      }
    }

    // Clear filters
    await page.click('button:has-text("Clear Filters")');
  });

  test('should generate vehicle reports', async ({ page }) => {
    // Open reports section
    await page.click('button:has-text("Reports")');

    if (await page.locator('text=Vehicle Reports').isVisible()) {
      // Select report type
      await page.click('text=Utilization Report');

      // Set date range
      await fillForm(page, {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      });

      // Generate report
      await page.click('button:has-text("Generate Report")');

      // Verify report generated
      await expect(page.locator('text=Report Generated')).toBeVisible();

      // Check download options
      await expect(page.locator('button:has-text("Download PDF")')).toBeVisible();
      await expect(page.locator('button:has-text("Download Excel")')).toBeVisible();
    }
  });

  test('should bulk update vehicle status', async ({ page }) => {
    // Select multiple vehicles
    const checkboxes = page.locator('input[type="checkbox"]').locator('visible=true');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 2) {
      // Select first 3 vehicles
      for (let i = 0; i < 3; i++) {
        await checkboxes.nth(i).check();
      }

      // Verify bulk actions appear
      await expect(page.locator('text=3 selected')).toBeVisible();

      // Perform bulk status update
      await page.click('button:has-text("Bulk Actions")');
      await page.click('text=Update Status');

      // Select new status
      await page.click('text=Maintenance');
      await page.click('button:has-text("Apply")');

      // Verify success
      await waitForToast(page, 'updated successfully');

      // Clear selection
      await page.click('button:has-text("Clear Selection")');
    }
  });

  test('should manage vehicle fuel logs', async ({ page }) => {
    const vehicleRow = page.locator('tbody tr').first();

    if (await vehicleRow.isVisible()) {
      await vehicleRow.click();

      // Navigate to fuel logs
      await page.click('button:has-text("Fuel Logs")');

      // Add fuel entry
      await page.click('button:has-text("Add Fuel Entry")');

      await fillForm(page, {
        date: new Date().toISOString().split('T')[0],
        odometerReading: '27000',
        fuelQuantity: '40',
        fuelCost: '3600',
        fuelStation: 'HP Petrol Pump',
      });

      await page.click('button:has-text("Save Entry")');
      await waitForToast(page, 'Fuel entry added');

      // Verify entry and calculate mileage
      await expect(page.locator('text=40 L')).toBeVisible();
      await expect(page.locator('text=₹3,600')).toBeVisible();

      // Check if mileage is calculated
      await expect(page.locator('text=/km\/l|mileage/i')).toBeVisible();
    }
  });
});
