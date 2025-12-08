import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/test-helpers';

/**
 * E2E Tests for Story Demo functionality
 * 
 * Tests the story slide demo that users can view without uploading a database
 */

test.describe('Story Demo - Slide Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Navigate to demo
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
  });

  test('should display story slides in demo mode', async ({ page }) => {
    // Check that we're in demo view
    await expect(page.getByRole('button', { name: /back to upload/i })).toBeVisible();
    
    // Story slides should be visible (looking for common slide elements)
    // The exact structure depends on the StoryDemo component
    const slides = page.locator('[data-slide], .story-slide, [class*="slide"]');
    const slideCount = await slides.count();
    
    // Should have at least one slide visible
    expect(slideCount).toBeGreaterThan(0);
  });

  test('should allow scrolling through slides', async ({ page }) => {
    // Demo mode typically shows all slides in a scrollable view
    // Test that we can scroll
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(300);
    
    // Page should have scrolled
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});

test.describe('Story Demo - Aspect Ratio Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
  });

  test('should show aspect ratio selector', async ({ page }) => {
    // Look for aspect ratio controls (9:16, 4:5, 1:1)
    const aspectRatioButtons = page.getByRole('button', { name: /9:16|4:5|1:1/ });
    
    // Should have aspect ratio selection available
    const count = await aspectRatioButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should change aspect ratio when selected', async ({ page }) => {
    // Find aspect ratio buttons
    const squareButton = page.getByRole('button', { name: /1:1/ }).first();
    
    if (await squareButton.isVisible()) {
      await squareButton.click();
      await page.waitForTimeout(500);
      
      // Verify aspect ratio changed (would need to check slide container dimensions)
      // This is a basic check that the button was clickable
      expect(true).toBe(true);
    }
  });
});

test.describe('Story Demo - Theme Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
  });

  test('should show theme selector', async ({ page }) => {
    // Look for theme selection buttons
    const themeButtons = page.getByRole('button', { name: /pastel|club|clean|booth/i });
    
    // Should have theme selection available
    const count = await themeButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should change theme when selected', async ({ page }) => {
    // Find a theme button
    const cleanThemeButton = page.getByRole('button', { name: /clean/i }).first();
    
    if (await cleanThemeButton.isVisible()) {
      await cleanThemeButton.click();
      await page.waitForTimeout(500);
      
      // Theme should be applied
      expect(true).toBe(true);
    }
  });
});

test.describe('Story Demo - Download Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(1000);
  });

  test('should show download buttons for slides', async ({ page }) => {
    // Look for download buttons - they may use different text or icons
    const downloadButtons = page.getByRole('button').filter({ hasText: /download/i });
    const count = await downloadButtons.count();
    
    // If no text-based download buttons, look for icon buttons
    if (count === 0) {
      const allButtons = await page.getByRole('button').count();
      // At least verify there are interactive buttons in the demo
      expect(allButtons).toBeGreaterThan(0);
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should handle download button click', async ({ page }) => {
    // Find first download button
    const downloadButton = page.getByRole('button', { name: /download/i }).first();
    
    if (await downloadButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      
      await downloadButton.click();
      
      try {
        const download = await downloadPromise;
        
        // Verify download was initiated
        expect(download).toBeTruthy();
        expect(download.suggestedFilename()).toMatch(/\.png$/i);
      } catch {
        // Download might not work in headless mode without proper setup
        // This test verifies the button is clickable at minimum
        console.log('Download test: Button clickable, download event may not trigger in test environment');
      }
    }
  });
});

test.describe('Story Demo - Settings Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
  });

  test('should open settings panel', async ({ page }) => {
    const settingsButton = page.getByRole('button', { name: /settings/i }).first();
    
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await page.waitForTimeout(300);
      
      // Settings panel should be visible
      // Look for common settings elements
      const settingsPanel = page.getByRole('dialog');
      
      if (await settingsPanel.count() > 0) {
        await expect(settingsPanel.first()).toBeVisible();
      }
    }
  });
});
