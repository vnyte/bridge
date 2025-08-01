import { test, expect, fillForm, waitForToast } from './utils/test-helpers';

const mockStaff = {
  firstName: 'Raj',
  lastName: 'Kumar',
  email: 'raj.kumar@drivingschool.com',
  phoneNumber: '9876543210',
  role: 'instructor',
  employeeId: 'EMP001',
  dateOfJoining: '2024-01-01',
  address: '789 Staff Colony',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400001',
  emergencyContact: 'Priya Kumar',
  emergencyContactPhone: '9876543211',
  licenseNumber: 'DL1234567890',
  licenseExpiry: '2030-12-31',
};

test.describe('Staff Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/staff'); // Assuming staff route exists
  });

  test('should display staff listing page', async ({ page }) => {
    // Check page elements
    await expect(page.locator('h1:has-text("Staff")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Staff")')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();

    // Check table headers
    const headers = ['Name', 'Role', 'Contact', 'Employee ID', 'Status', 'Actions'];
    for (const header of headers) {
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('should add new staff member', async ({ page }) => {
    await page.click('button:has-text("Add Staff")');

    // Check dialog opened
    await expect(page.locator('h2:has-text("Add New Staff")')).toBeVisible();

    // Fill staff details
    await fillForm(page, {
      firstName: mockStaff.firstName,
      lastName: mockStaff.lastName,
      email: mockStaff.email,
      phoneNumber: mockStaff.phoneNumber,
      role: mockStaff.role,
      employeeId: mockStaff.employeeId,
      dateOfJoining: mockStaff.dateOfJoining,
      address: mockStaff.address,
      city: mockStaff.city,
      state: mockStaff.state,
      postalCode: mockStaff.postalCode,
      emergencyContact: mockStaff.emergencyContact,
      emergencyContactPhone: mockStaff.emergencyContactPhone,
    });

    // Add instructor license if role is instructor
    if (mockStaff.role === 'instructor') {
      await fillForm(page, {
        licenseNumber: mockStaff.licenseNumber,
        licenseExpiry: mockStaff.licenseExpiry,
      });

      // Select vehicle classes instructor can teach
      await page.click('input[value="LMV"]');
      await page.click('input[value="MCWG"]');
    }

    // Submit form
    await page.click('button:has-text("Save")');

    // Verify success
    await waitForToast(page, 'Staff member added successfully');

    // Verify staff appears in list
    await expect(page.locator(`text=${mockStaff.firstName} ${mockStaff.lastName}`)).toBeVisible();
    await expect(page.locator(`text=${mockStaff.employeeId}`)).toBeVisible();
  });

  test('should filter staff by role', async ({ page }) => {
    // Filter by role
    const roleFilter = page.locator('select[name="role"]');
    if (await roleFilter.isVisible()) {
      await roleFilter.selectOption('instructor');
      await page.waitForTimeout(500);

      // Verify filtered results show only instructors
      const roles = page.locator('td:has-text("Instructor")');
      const count = await roles.count();

      if (count > 0) {
        // All visible staff should be instructors
        const staffRows = page.locator('tbody tr');
        for (let i = 0; i < (await staffRows.count()); i++) {
          const role = await staffRows.nth(i).locator('td:nth-child(2)').textContent();
          expect(role?.toLowerCase()).toContain('instructor');
        }
      }
    }
  });

  test('should manage staff schedule', async ({ page }) => {
    // Click on first staff member
    const staffRows = page.locator('tbody tr');

    if ((await staffRows.count()) > 0) {
      await staffRows.first().click();
      await page.waitForURL(/\/staff\/[^\/]+$/);

      // Navigate to schedule tab
      await page.click('button:has-text("Schedule")');

      // Check schedule view
      await expect(page.locator('text=Weekly Schedule')).toBeVisible();

      // Add new schedule slot
      await page.click('button:has-text("Add Schedule")');

      await fillForm(page, {
        dayOfWeek: 'monday',
        startTime: '09:00',
        endTime: '17:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      });

      await page.click('button:has-text("Save Schedule")');
      await waitForToast(page, 'Schedule updated successfully');

      // Verify schedule appears
      await expect(page.locator('text=Monday')).toBeVisible();
      await expect(page.locator('text=09:00 - 17:00')).toBeVisible();
    }
  });

  test('should track staff attendance', async ({ page }) => {
    // Navigate to first staff member
    const staffRows = page.locator('tbody tr');

    if ((await staffRows.count()) > 0) {
      await staffRows.first().click();

      // Navigate to attendance tab
      await page.click('button:has-text("Attendance")');

      // Mark attendance
      await page.click('button:has-text("Mark Attendance")');

      await fillForm(page, {
        date: new Date().toISOString().split('T')[0],
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'present',
      });

      await page.click('button:has-text("Save Attendance")');
      await waitForToast(page, 'Attendance marked successfully');

      // View attendance report
      await page.click('button:has-text("View Report")');

      // Check attendance statistics
      await expect(page.locator('text=Attendance Summary')).toBeVisible();
      await expect(page.locator('text=/Present|Absent|Late/i')).toBeVisible();
    }
  });

  test('should manage staff leave requests', async ({ page }) => {
    // Navigate to first staff member
    const staffRows = page.locator('tbody tr');

    if ((await staffRows.count()) > 0) {
      await staffRows.first().click();

      // Navigate to leaves tab
      await page.click('button:has-text("Leaves")');

      // Apply for leave
      await page.click('button:has-text("Apply Leave")');

      await fillForm(page, {
        leaveType: 'casual',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reason: 'Personal work',
      });

      await page.click('button:has-text("Submit Leave Request")');
      await waitForToast(page, 'Leave request submitted');

      // Check leave status
      await expect(page.locator('text=Pending')).toBeVisible();

      // Approve/Reject leave (if admin)
      const approveButton = page.locator('button:has-text("Approve")');
      if (await approveButton.isVisible()) {
        await approveButton.click();
        await waitForToast(page, 'Leave approved');
      }
    }
  });

  test('should assign vehicles to instructors', async ({ page }) => {
    // Filter to show only instructors
    const roleFilter = page.locator('select[name="role"]');
    if (await roleFilter.isVisible()) {
      await roleFilter.selectOption('instructor');
      await page.waitForTimeout(500);
    }

    // Click on first instructor
    const instructorRows = page.locator('tbody tr');

    if ((await instructorRows.count()) > 0) {
      await instructorRows.first().click();

      // Navigate to vehicles tab
      await page.click('button:has-text("Assigned Vehicles")');

      // Assign vehicle
      await page.click('button:has-text("Assign Vehicle")');

      // Select vehicle from dropdown
      const vehicleSelect = page.locator('select[name="vehicleId"]');
      if (await vehicleSelect.isVisible()) {
        const options = await vehicleSelect.locator('option').count();
        if (options > 1) {
          await vehicleSelect.selectOption({ index: 1 });
        }
      }

      // Set assignment period
      await fillForm(page, {
        assignmentType: 'permanent',
        effectiveFrom: new Date().toISOString().split('T')[0],
      });

      await page.click('button:has-text("Assign")');
      await waitForToast(page, 'Vehicle assigned successfully');
    }
  });

  test('should track instructor performance', async ({ page }) => {
    // Filter to show only instructors
    const roleFilter = page.locator('select[name="role"]');
    if (await roleFilter.isVisible()) {
      await roleFilter.selectOption('instructor');
      await page.waitForTimeout(500);
    }

    // Click on first instructor
    const instructorRows = page.locator('tbody tr');

    if ((await instructorRows.count()) > 0) {
      await instructorRows.first().click();

      // Navigate to performance tab
      await page.click('button:has-text("Performance")');

      // Check performance metrics
      await expect(page.locator('text=Performance Metrics')).toBeVisible();
      await expect(page.locator('text=Students Trained')).toBeVisible();
      await expect(page.locator('text=Pass Rate')).toBeVisible();
      await expect(page.locator('text=Average Rating')).toBeVisible();

      // Add performance review
      await page.click('button:has-text("Add Review")');

      await fillForm(page, {
        reviewPeriod: 'Q1 2024',
        rating: '4.5',
        studentsTrainedCount: '25',
        passRate: '85',
        comments: 'Excellent instructor with good student feedback',
      });

      await page.click('button:has-text("Save Review")');
      await waitForToast(page, 'Review added successfully');
    }
  });

  test('should manage staff documents', async ({ page }) => {
    // Navigate to first staff member
    const staffRows = page.locator('tbody tr');

    if ((await staffRows.count()) > 0) {
      await staffRows.first().click();

      // Navigate to documents tab
      await page.click('button:has-text("Documents")');

      // Upload document
      await page.click('button:has-text("Upload Document")');

      await fillForm(page, {
        documentType: 'identity',
        documentName: 'Aadhar Card',
        documentNumber: '1234-5678-9012',
      });

      // File upload would happen here in real scenario
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // In real test, would upload a file
        // await fileInput.setInputFiles('path/to/document.pdf');
      }

      await page.click('button:has-text("Upload")');

      // Verify document appears
      await expect(page.locator('text=Aadhar Card')).toBeVisible();
    }
  });

  test('should handle staff payroll', async ({ page }) => {
    // Navigate to first staff member
    const staffRows = page.locator('tbody tr');

    if ((await staffRows.count()) > 0) {
      await staffRows.first().click();

      // Navigate to payroll tab
      await page.click('button:has-text("Payroll")');

      // Check salary details
      await expect(page.locator('text=Salary Details')).toBeVisible();

      // Process salary
      await page.click('button:has-text("Process Salary")');

      await fillForm(page, {
        month: 'January',
        year: '2024',
        basicSalary: '30000',
        allowances: '5000',
        deductions: '2000',
        paymentMethod: 'bank_transfer',
      });

      await page.click('button:has-text("Process Payment")');
      await waitForToast(page, 'Salary processed successfully');

      // Generate pay slip
      await page.click('button:has-text("Generate Pay Slip")');
      await expect(page.locator('text=Pay Slip Generated')).toBeVisible();
    }
  });

  test('should deactivate staff member', async ({ page }) => {
    // Find a staff member to deactivate
    const staffRows = page.locator('tbody tr');

    if ((await staffRows.count()) > 0) {
      // Click on actions menu for first staff
      await staffRows.first().locator('button[aria-label="Staff actions"]').click();

      // Click deactivate
      await page.click('text=Deactivate');

      // Confirm deactivation
      await expect(
        page.locator('text=Are you sure you want to deactivate this staff member?')
      ).toBeVisible();

      await fillForm(page, {
        reason: 'resignation',
        lastWorkingDate: new Date().toISOString().split('T')[0],
        notes: 'Moving to another city',
      });

      await page.click('button:has-text("Deactivate")');
      await waitForToast(page, 'Staff member deactivated');

      // Verify status changed to inactive
      await expect(staffRows.first().locator('text=Inactive')).toBeVisible();
    }
  });
});
