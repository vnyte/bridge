# E2E Tests

This directory contains end-to-end tests for the Bridge driving school management system using Playwright.

## Running Tests

```bash
# Run all tests
bun test:e2e

# Run tests in UI mode
bun test:e2e:ui

# Run tests in debug mode
bun test:e2e:debug

# Run tests in headed mode (see browser)
bun test:e2e:headed

# Run specific test file
bun test:e2e auth.spec.ts

# Run tests in specific browser
bun test:e2e --project=chromium
bun test:e2e --project=firefox
bun test:e2e --project=webkit
```

## Test Structure

- `auth.spec.ts` - Authentication flow tests (sign-in, sign-up, redirects)
- `admission.spec.ts` - Client admission process tests (multi-step form)
- `vehicles.spec.ts` - Vehicle management tests (CRUD operations)
- `utils/test-helpers.ts` - Common test utilities and helpers
- `utils/mock-data.ts` - Mock data for testing

## Writing Tests

1. Import necessary utilities:

```typescript
import { test, expect, ROUTES, fillForm, waitForToast } from './utils/test-helpers';
import { mockClient, mockVehicle } from './utils/mock-data';
```

2. Structure tests with describe blocks:

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## Notes

- Tests currently skip authentication - in production, you'd need to implement proper auth setup
- Some tests are marked as `.skip()` as they require API mocking or test database setup
- The `webServer` configuration in `playwright.config.ts` automatically starts the dev server before tests

## Best Practices

1. Use data-testid attributes for reliable element selection
2. Wait for network idle when appropriate
3. Use Page Object Model for complex pages
4. Keep tests independent and idempotent
5. Mock external dependencies when needed
