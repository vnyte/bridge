# Data-TestID Reference Guide

This document lists all the required `data-testid` attributes that need to be added to your React components for the E2E tests to work properly.

## Authentication Pages

### Sign-In Page (`/sign-in`)

```tsx
<div data-testid="signin-page">
  <h1 data-testid="signin-heading">Sign In</h1>
  <input data-testid="signin-email-input" name="identifier" />
  <input data-testid="signin-password-input" name="password" />
  <button data-testid="signin-submit-button" type="submit">
    Sign In
  </button>
  <a data-testid="signin-signup-link">Sign up</a>
  <div data-testid="signin-error-message">Error message</div>
</div>
```

### Sign-Up Page (`/sign-up`)

```tsx
<div data-testid="signup-page">
  <h1 data-testid="signup-heading">Sign Up</h1>
  <input data-testid="signup-email-input" name="emailAddress" />
  <button data-testid="signup-submit-button" type="submit">
    Sign Up
  </button>
  <a data-testid="signup-signin-link">Sign in</a>
</div>
```

## Admission Flow (`/admission`)

### Step Navigation

```tsx
<div data-testid="admission-step-1">Step 1 Content</div>
<div data-testid="admission-step-2">Step 2 Content</div>
<div data-testid="admission-step-3">Step 3 Content</div>
<div data-testid="admission-step-4">Step 4 Content</div>
<div data-testid="admission-step-5">Step 5 Content</div>
```

### Step 1: Personal Information

```tsx
<h2 data-testid="admission-personal-info-heading">Personal Information</h2>
<input data-testid="admission-firstName-input" name="firstName" />
<input data-testid="admission-lastName-input" name="lastName" />
<input data-testid="admission-email-input" name="email" />
<input data-testid="admission-phoneNumber-input" name="phoneNumber" />
<input data-testid="admission-dateOfBirth-input" name="dateOfBirth" />
<input data-testid="admission-address-input" name="address" />
<input data-testid="admission-city-input" name="city" />
<input data-testid="admission-state-input" name="state" />
<input data-testid="admission-postalCode-input" name="postalCode" />
<input data-testid="admission-emergencyContact-input" name="emergencyContact" />
<input data-testid="admission-emergencyContactPhone-input" name="emergencyContactPhone" />
<button data-testid="admission-next-button">Next</button>
```

### Step 2: License Details

```tsx
<h2 data-testid="admission-license-details-heading">License Details</h2>
<button data-testid="admission-add-learning-license-button">Add Learning License</button>
<input data-testid="license-llNumber-input" name="llNumber" />
<input data-testid="license-issueDate-input" name="issueDate" />
<input data-testid="license-expiryDate-input" name="expiryDate" />
<input data-testid="license-rtoOffice-input" name="rtoOffice" />
<input data-testid="license-vehicleClass-LMV-checkbox" value="LMV" />
<input data-testid="license-vehicleClass-MCWG-checkbox" value="MCWG" />
```

### Step 3: Plan & Pricing

```tsx
<h2 data-testid="admission-plan-pricing-heading">Plan & Pricing</h2>
<div data-testid="plan-card-1">Plan 1</div>
<div data-testid="plan-card-2">Plan 2</div>
<input data-testid="payment-method-cash-radio" value="cash" />
<input data-testid="payment-method-online-radio" value="online" />
<input data-testid="payment-installment-2-radio" value="2" />
<input data-testid="payment-firstInstallment-input" name="firstInstallment" />
<input data-testid="payment-secondInstallment-input" name="secondInstallment" />
```

### Step 4: Vehicle Assignment

```tsx
<h2 data-testid="admission-vehicle-assignment-heading">Vehicle Assignment</h2>
<div data-testid="vehicle-card-1">Vehicle 1</div>
<div data-testid="vehicle-card-2">Vehicle 2</div>
<input data-testid="training-startDate-input" name="trainingStartDate" />
```

### Step 5: Review & Submit

```tsx
<h2 data-testid="admission-review-submit-heading">Review & Submit</h2>
<div data-testid="review-client-name">John Doe</div>
<div data-testid="review-client-email">john@example.com</div>
<div data-testid="review-license-number">LL123456789</div>
<button data-testid="admission-submit-button">Submit</button>
```

## Clients Page (`/clients`)

### Main Page

```tsx
<div data-testid="clients-page">
  <h1 data-testid="clients-page-heading">Clients</h1>
  <button data-testid="clients-add-button">Add Client</button>
  <input data-testid="clients-search-input" placeholder="Search clients..." />

  <table data-testid="clients-table">
    <thead>
      <th data-testid="clients-table-header-name">Name</th>
      <th data-testid="clients-table-header-contact">Contact</th>
      <th data-testid="clients-table-header-licenses">Licenses</th>
      <th data-testid="clients-table-header-status">Status</th>
      <th data-testid="clients-table-header-actions">Actions</th>
    </thead>
    <tbody>
      <tr data-testid="client-row-123">Client Row</tr>
    </tbody>
  </table>
</div>
```

### Client Details Page

```tsx
<div data-testid="client-details-page">
  <h1 data-testid="client-details-heading">Client Details</h1>
  <button data-testid="client-edit-button">Edit</button>

  <div data-testid="client-phone-display">9876543210</div>
  <div data-testid="client-address-display">123 Main St</div>

  <button data-testid="client-licenses-tab">Licenses</button>
  <button data-testid="client-payments-tab">Payments</button>

  <div data-testid="client-licenses-list">Licenses List</div>
  <button data-testid="client-add-driving-license-button">Add Driving License</button>

  <div data-testid="client-payment-history-heading">Payment History</div>
  <table data-testid="client-payments-table">
    <thead>
      <th data-testid="payments-table-header-date">Date</th>
      <th data-testid="payments-table-header-amount">Amount</th>
      <th data-testid="payments-table-header-method">Method</th>
      <th data-testid="payments-table-header-status">Status</th>
    </thead>
  </table>
  <button data-testid="client-add-payment-button">Add Payment</button>
</div>
```

### Client Edit Form

```tsx
<input data-testid="client-phoneNumber-input" name="phoneNumber" />
<input data-testid="client-address-input" name="address" />
<input data-testid="client-city-input" name="city" />
<button data-testid="client-save-button">Save</button>
```

## Vehicles Page (`/vehicles`)

### Main Page

```tsx
<div data-testid="vehicles-page">
  <h1 data-testid="vehicles-page-heading">Vehicles</h1>
  <button data-testid="vehicles-add-button">Add Vehicle</button>
  <input data-testid="vehicles-search-input" placeholder="Search vehicles..." />
  <select data-testid="vehicles-type-filter" name="vehicleType"></select>
  <select data-testid="vehicles-status-filter" name="status"></select>

  <table data-testid="vehicles-table">
    <tbody>
      <tr data-testid="vehicle-row-MH01AB1234">
        <button data-testid="vehicle-edit-button-MH01AB1234">Edit</button>
        <button data-testid="vehicle-delete-button-MH01AB1234">Delete</button>
      </tr>
    </tbody>
  </table>
</div>
```

### Vehicle Add/Edit Modal

```tsx
<div data-testid="vehicle-add-modal">
  <h2 data-testid="vehicle-add-modal-heading">Add New Vehicle</h2>
  <input data-testid="vehicle-registrationNumber-input" name="registrationNumber" />
  <input data-testid="vehicle-make-input" name="make" />
  <input data-testid="vehicle-model-input" name="model" />
  <input data-testid="vehicle-year-input" name="year" />
  <select data-testid="vehicle-type-select" name="vehicleType"></select>
  <select data-testid="vehicle-fuelType-select" name="fuelType"></select>
  <select data-testid="vehicle-transmissionType-select" name="transmissionType"></select>
  <input data-testid="vehicle-insuranceNumber-input" name="insuranceNumber" />
  <input data-testid="vehicle-insuranceExpiry-input" name="insuranceExpiry" />
  <input data-testid="vehicle-pucNumber-input" name="pucNumber" />
  <input data-testid="vehicle-pucExpiry-input" name="pucExpiry" />
  <input data-testid="vehicle-registrationExpiry-input" name="registrationExpiry" />

  <div data-testid="vehicle-maintenance-section">
    <input data-testid="vehicle-lastServiceDate-input" name="lastServiceDate" />
    <input data-testid="vehicle-nextServiceDue-input" name="nextServiceDue" />
    <input data-testid="vehicle-odometerReading-input" name="odometerReading" />
  </div>

  <button data-testid="vehicle-save-button">Save</button>
  <button data-testid="vehicle-update-button">Update</button>
  <button data-testid="modal-close-button">Close</button>
</div>
```

### Vehicle Details Modal

```tsx
<div data-testid="vehicle-details-modal">
  <div data-testid="vehicle-make-model-display">Toyota Corolla</div>
  <div data-testid="vehicle-type-display">LMV</div>
  <div data-testid="vehicle-insurance-section">Insurance Info</div>
  <div data-testid="vehicle-puc-section">PUC Info</div>
</div>
```

## Common Elements

### Modals

```tsx
<div data-testid="confirm-delete-modal">
  <div data-testid="confirm-delete-message">Are you sure?</div>
  <button data-testid="confirm-delete-cancel-button">Cancel</button>
  <button data-testid="confirm-delete-confirm-button">Confirm</button>
</div>
```

### License Forms

```tsx
<input data-testid="license-dlNumber-input" name="dlNumber" />
<input data-testid="license-issueDate-input" name="issueDate" />
<input data-testid="license-expiryDate-input" name="expiryDate" />
<input data-testid="license-rtoOffice-input" name="rtoOffice" />
<button data-testid="license-save-button">Save</button>
```

## Dashboard Page (`/dashboard`)

```tsx
<div data-testid="dashboard-page">
  <h1 data-testid="dashboard-heading">Dashboard</h1>
  <div data-testid="dashboard-total-clients">Total Clients</div>
  <div data-testid="dashboard-active-vehicles">Active Vehicles</div>
  <div data-testid="dashboard-total-revenue">Total Revenue</div>
  <div data-testid="dashboard-pending-payments">Pending Payments</div>
</div>
```

## Implementation Tips

1. **Add test IDs incrementally** - Start with the most critical user flows
2. **Use consistent naming** - Follow the patterns shown above
3. **Dynamic IDs for lists** - Use unique identifiers like `client-row-${id}`
4. **Test ID in root elements** - Add to containers, forms, modals
5. **Semantic naming** - Use descriptive names that indicate the element's purpose

## Next Steps

1. Add these `data-testid` attributes to your React components
2. Run the E2E tests to verify they work
3. Update any missing or incorrect test IDs based on test failures
4. Document any custom test IDs you add for future reference
