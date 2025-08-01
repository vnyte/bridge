# E2E Testing Guide: Using data-testid Attributes

## Why data-testid?

Using `data-testid` attributes is the recommended approach for E2E testing because:

1. **Stability**: Unlike CSS classes or text content, test IDs don't change with styling or copy updates
2. **Clarity**: Makes it obvious which elements are used in tests
3. **Performance**: Direct attribute selection is faster than complex selectors
4. **Maintainability**: Easy to update tests when UI changes

## Implementation in Your React Components

### Example 1: Form Inputs

```tsx
// ❌ BAD: No test IDs
<input
  name="firstName"
  className="w-full px-3 py-2 border rounded"
  placeholder="Enter first name"
/>

// ✅ GOOD: With test ID
<input
  data-testid="admission-firstName-input"
  name="firstName"
  className="w-full px-3 py-2 border rounded"
  placeholder="Enter first name"
/>
```

### Example 2: Buttons

```tsx
// ❌ BAD: Relying on text content
<button onClick={handleNext}>
  Next
</button>

// ✅ GOOD: With test ID
<button
  data-testid="admission-next-button"
  onClick={handleNext}
>
  Next
</button>
```

### Example 3: Table Rows

```tsx
// ✅ GOOD: Dynamic test IDs for table rows
{
  clients.map((client) => (
    <tr key={client.id} data-testid={`client-row-${client.id}`}>
      <td>{client.name}</td>
      <td>
        <button
          data-testid={`client-edit-button-${client.id}`}
          onClick={() => handleEdit(client.id)}
        >
          Edit
        </button>
      </td>
    </tr>
  ));
}
```

### Example 4: Error Messages

```tsx
// ✅ GOOD: Test IDs for validation errors
{
  errors.firstName && (
    <span data-testid="admission-firstName-error" className="text-red-500 text-sm">
      {errors.firstName}
    </span>
  );
}
```

## Naming Conventions

### 1. Pages/Routes

- Pattern: `{page}-page`
- Examples: `dashboard-page`, `clients-page`, `admission-page`

### 2. Forms

- Inputs: `{context}-{fieldName}-input`
- Selects: `{context}-{fieldName}-select`
- Checkboxes: `{context}-{fieldName}-checkbox`
- Examples: `admission-firstName-input`, `vehicle-type-select`

### 3. Buttons

- Pattern: `{context}-{action}-button`
- Examples: `admission-next-button`, `vehicle-save-button`, `client-delete-button`

### 4. Tables

- Table: `{entity}-table`
- Row: `{entity}-row-{id}`
- Cell: `{entity}-{field}-cell-{id}`
- Examples: `clients-table`, `client-row-123`, `client-status-cell-123`

### 5. Lists

- Container: `{entity}-list`
- Item: `{entity}-item-{id}`
- Examples: `vehicles-list`, `vehicle-item-MH01AB1234`

### 6. Modals/Dialogs

- Pattern: `{context}-{type}-modal`
- Examples: `vehicle-add-modal`, `client-edit-modal`, `confirm-delete-modal`

### 7. Status/States

- Pattern: `{context}-status-{value}`
- Examples: `payment-status-completed`, `vehicle-status-active`

### 8. Error Messages

- Pattern: `{context}-{field}-error`
- Examples: `admission-firstName-error`, `payment-amount-error`

## Using Test IDs in Playwright Tests

### Basic Usage

```typescript
// Import helpers
import { getByTestId, clickTestId, fillTestId } from './utils/test-helpers';

// Get element by test ID
const dashboard = getByTestId(page, 'dashboard-page');
await expect(dashboard).toBeVisible();

// Click element by test ID
await clickTestId(page, 'admission-next-button');

// Fill input by test ID
await fillTestId(page, 'admission-firstName-input', 'John');

// Select option
await getByTestId(page, 'vehicle-type-select').selectOption('LMV');

// Check checkbox
await getByTestId(page, 'terms-checkbox').check();
```

### Complex Interactions

```typescript
// Working with table rows
const clientRow = getByTestId(page, 'client-row-123');
await clientRow.locator('[data-testid="client-edit-button"]').click();

// Working with lists
const vehicleItems = page.locator('[data-testid^="vehicle-item-"]');
await expect(vehicleItems).toHaveCount(10);

// Waiting for elements
await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' });
await expect(getByTestId(page, 'success-message')).toBeVisible();
```

## Migration Strategy

To migrate existing tests to use data-testid:

1. **Add test IDs to components** following the naming conventions
2. **Update test selectors** to use the new test IDs
3. **Run tests** to ensure they still pass
4. **Remove old selectors** once migration is complete

### Before:

```typescript
await page.click('button:has-text("Save")');
await page.fill('input[name="email"]', 'test@example.com');
```

### After:

```typescript
await clickTestId(page, 'form-save-button');
await fillTestId(page, 'user-email-input', 'test@example.com');
```

## Best Practices

1. **Always use data-testid** for E2E tests, never rely on:

   - CSS classes (they change with styling)
   - Text content (it changes with copy updates)
   - Element order (it changes with layout updates)

2. **Keep test IDs stable** - don't change them unless necessary

3. **Use semantic names** that describe the element's purpose

4. **Document test IDs** in component comments when they're not obvious

5. **Be consistent** with naming conventions across the application

6. **Avoid dynamic test IDs** unless necessary (like for table rows with IDs)

7. **Clean up unused test IDs** when removing features

## Component Example

Here's a complete example of a component with proper test IDs:

```tsx
export function VehicleForm({ onSubmit }: VehicleFormProps) {
  return (
    <form data-testid="vehicle-form" onSubmit={onSubmit}>
      <div>
        <label htmlFor="registration">Registration Number</label>
        <input
          id="registration"
          data-testid="vehicle-registrationNumber-input"
          name="registrationNumber"
          required
        />
        <span data-testid="vehicle-registrationNumber-error" className="error">
          {errors.registrationNumber}
        </span>
      </div>

      <div>
        <label htmlFor="type">Vehicle Type</label>
        <select id="type" data-testid="vehicle-type-select" name="vehicleType" required>
          <option value="">Select type</option>
          <option value="LMV">LMV</option>
          <option value="MCWG">MCWG</option>
        </select>
      </div>

      <button type="submit" data-testid="vehicle-save-button">
        Save Vehicle
      </button>
    </form>
  );
}
```

This approach ensures your E2E tests are maintainable, reliable, and easy to understand.
