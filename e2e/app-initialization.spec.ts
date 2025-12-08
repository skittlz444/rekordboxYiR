import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/test-helpers';

/**
 * E2E Tests for Rekordbox Year in Review
 * 
 * These tests cover the critical user flows:
 * - Initial page load
 * - Story demo view
 * - Configuration settings
 * - UI interactions
 */

test.describe('Application Initialization', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check that main heading is visible
    await expect(page.getByRole('heading', { name: /rekordbox year in review/i })).toBeVisible();
    
    // Check that upload container or demo link is visible
    const demoLink = page.getByRole('button', { name: /view story slide demo/i });
    await expect(demoLink).toBeVisible();
  });

  test('should display upload form with configuration options', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check for upload card
    await expect(page.getByText(/upload library/i)).toBeVisible();
    await expect(page.getByText(/upload your rekordbox master\.db/i)).toBeVisible();
  });
});

test.describe('Story Demo View', () => {
  test('should navigate to story demo', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Click on demo link
    const demoLink = page.getByRole('button', { name: /view story slide demo/i });
    await demoLink.click();
    
    // Wait for demo to load
    await page.waitForTimeout(500);
    
    // Check that we're in demo view
    await expect(page.getByRole('button', { name: /back to upload/i })).toBeVisible();
  });

  test('should navigate back from demo to upload', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Go to demo
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
    
    // Go back
    await page.getByRole('button', { name: /back to upload/i }).click();
    await page.waitForTimeout(500);
    
    // Should be back at upload
    await expect(page.getByText(/upload library/i)).toBeVisible();
  });
});

test.describe('Configuration Settings', () => {
  test('should allow changing target year', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Find year input
    const yearInput = page.getByLabel(/target year/i);
    await expect(yearInput).toBeVisible();
    
    // Change year
    await yearInput.fill('2023');
    
    // Verify value changed
    await expect(yearInput).toHaveValue('2023');
  });

  test('should allow setting DJ name', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Find DJ name input
    const djNameInput = page.getByLabel(/dj name/i);
    await expect(djNameInput).toBeVisible();
    
    // Set name
    await djNameInput.fill('Test DJ');
    
    // Verify value changed
    await expect(djNameInput).toHaveValue('Test DJ');
  });

  test('should allow setting comparison year', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Find comparison year input
    const comparisonYearInput = page.getByLabel(/comparison year/i);
    
    // Set comparison year
    await comparisonYearInput.fill('2023');
    
    // Verify value changed
    await expect(comparisonYearInput).toHaveValue('2023');
  });

  test('should allow adjusting playtime estimation percentage', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Find playtime percentage input - exact label from UploadContainer
    const playtimeInput = page.getByLabel(/average track played %/i);
    await expect(playtimeInput).toBeVisible();
    
    // Change percentage (value is 0-1, so 0.8 = 80%)
    await playtimeInput.fill('0.8');
    
    // Verify value changed
    await expect(playtimeInput).toHaveValue('0.8');
  });
});

test.describe('File Upload Interaction', () => {
  test('should show drag and drop zone', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check for dropzone text - matching actual FileDropzone component
    const dropzoneText = page.getByText(/click or drag to upload/i);
    await expect(dropzoneText).toBeVisible();
  });

  test('should display file upload UI elements', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Verify upload-related UI is present
    await expect(page.getByText(/upload library/i)).toBeVisible();
    await expect(page.getByText(/master\.db/i).first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check that main elements are still visible
    await expect(page.getByRole('heading', { name: /rekordbox year in review/i })).toBeVisible();
    await expect(page.getByText(/upload library/i)).toBeVisible();
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check that main elements are still visible
    await expect(page.getByRole('heading', { name: /rekordbox year in review/i })).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check for h1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check that form inputs have labels
    const yearInput = page.getByLabel(/target year/i);
    await expect(yearInput).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Tab through elements
    await page.keyboard.press('Tab');
    
    // Check that focus is on an interactive element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'A']).toContain(focusedElement);
  });
});
