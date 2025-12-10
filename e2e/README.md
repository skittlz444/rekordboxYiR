# End-to-End (E2E) Testing

This directory contains Playwright E2E tests for the Rekordbox Year in Review application.

## Overview

The E2E test suite covers critical user flows and ensures the application works correctly from a user's perspective. Tests are organized into logical groups:

### Test Files

- **`app-initialization.spec.ts`** - Tests for application loading, configuration, and basic UI interactions
- **`story-demo.spec.ts`** - Tests for the story demo functionality including navigation, themes, and downloads
- **`theme-and-visual.spec.ts`** - Tests for theme system, dark mode, and visual consistency

### Test Coverage

#### Application Initialization
- ✅ Application loads successfully
- ✅ Upload form displays with configuration options
- ✅ Story demo navigation
- ✅ Configuration settings (year, DJ name, playtime estimation)
- ✅ File upload UI elements
- ✅ Responsive design (mobile, tablet)
- ✅ Accessibility (headings, labels, keyboard navigation)

#### Story Demo
- ✅ Slide display and navigation
- ✅ Aspect ratio selection (9:16, 4:5, 1:1)
- ✅ Theme selection (Pastel, Club, Clean, Booth)
- ✅ Download functionality
- ✅ Settings panel

#### Theme and Visual
- ✅ Default theme application
- ✅ Theme persistence across navigation
- ✅ Dark mode support
- ✅ Visual consistency
- ✅ Aspect ratio settings
- ✅ Animations and transitions
- ✅ Reduced motion support

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Playwright)
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Run All Tests

```bash
# Run all E2E tests in headless mode
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug
```

### Run Specific Tests

```bash
# Run a specific test file
npx playwright test e2e/app-initialization.spec.ts

# Run tests matching a pattern
npx playwright test -g "Configuration Settings"

# Run tests in a specific browser
npx playwright test --project=chromium
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

View trace files for failed tests:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

## Configuration

Test configuration is in `playwright.config.ts`. Key settings:

- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Browsers**: Chromium (can be expanded to Firefox, WebKit)
- **Workers**: 1 on CI (sequential), unlimited locally (parallel)
- **Reporters**: 
  - HTML report (saved to `playwright-report/`)
  - JUnit XML (for CI test result comments)
  - GitHub Actions reporter (for inline annotations on CI)
  - List reporter (console output)

## Helpers and Fixtures

### Test Helpers (`e2e/helpers/test-helpers.ts`)

Reusable utility functions:
- `waitForAppReady()` - Wait for app to be ready
- `waitForSlideVisible()` - Wait for a specific slide
- `navigateStoryMode()` - Navigate through story slides
- `closeStoryMode()` - Close story overlay
- `openSettings()` - Open settings panel

### Mock Data (`e2e/fixtures/mock-data.ts`)

Mock stats response for testing (currently not used in tests as they test the UI without actual data upload).

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/test-helpers';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Test actions
    await page.getByRole('button', { name: /click me/i }).click();
    
    // Assertions
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic locators**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Wait for elements**: Use `await expect(...).toBeVisible()` instead of manual waits
3. **Group related tests**: Use `test.describe()` to organize tests
4. **Use helpers**: Extract common patterns into helper functions
5. **Test user flows**: Focus on real user scenarios, not implementation details
6. **Keep tests isolated**: Each test should be independent
7. **Use meaningful names**: Test names should describe what they're testing

## CI/CD Integration

E2E tests run automatically in GitHub Actions on every PR. The workflow:

1. Installs dependencies
2. Runs unit tests with coverage
3. Installs Playwright browsers
4. Runs E2E tests
5. **Publishes all test results as PR comments** (combined unit and E2E test summary)
6. Uploads Playwright HTML report as artifact
7. Uploads coverage reports and screenshots/videos on failure

Test results are posted to PR comments in a single summary showing:
- Total tests run (both unit and E2E)
- Pass/fail counts
- Duration
- Failed test details (if any)
- Separate sections for unit tests and E2E tests

See `.github/workflows/ci.yml` for the complete configuration.

## Troubleshooting

### Tests fail locally but pass in CI (or vice versa)

- Check if you're using the latest browsers: `npx playwright install`
- Ensure dev server is running: `npm run dev:client`
- Check for port conflicts (default: 5173)

### Tests are slow

- Reduce parallel workers in `playwright.config.ts`
- Use `test.only()` to run a single test during development
- Increase timeout for specific slow tests

### Screenshots/videos not captured

- Ensure `test-results/` directory is writable
- Check `playwright.config.ts` for screenshot/video settings
- Artifacts are only captured on failures by default

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
