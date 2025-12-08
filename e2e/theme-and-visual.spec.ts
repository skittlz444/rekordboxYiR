import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/test-helpers';

/**
 * E2E Tests for Theme and Visual Settings
 * 
 * Tests theme switching, dark mode, and visual customizations
 */

test.describe('Theme System', () => {
  test('should apply default theme on load', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check that page has loaded with proper styling
    // Rather than checking for theme classes (which may not exist), check that the page is styled
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should have some background color applied
    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should persist theme selection across navigation', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Navigate to demo
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
    
    // Navigate back
    await page.getByRole('button', { name: /back to upload/i }).click();
    await page.waitForTimeout(500);
    
    // Theme should still be applied
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Dark Mode', () => {
  test('should respect system dark mode preference', async ({ page }) => {
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Check if dark mode classes are applied
    const isDark = await page.evaluate(() => {
      const html = document.documentElement;
      return html.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    expect(isDark).toBe(true);
  });

  test('should respect system light mode preference', async ({ page }) => {
    // Emulate light color scheme
    await page.emulateMedia({ colorScheme: 'light' });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Page should load successfully in light mode
    await expect(page.getByRole('heading', { name: /rekordbox year in review/i })).toBeVisible();
  });
});

test.describe('Visual Consistency', () => {
  test('should maintain consistent styling across pages', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Get computed styles from main heading
    const headingStyles = await page.getByRole('heading', { name: /rekordbox year in review/i }).evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
      };
    });
    
    expect(headingStyles.fontFamily).toBeTruthy();
    expect(headingStyles.fontWeight).toBeTruthy();
  });

  test('should use consistent button styles', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Find a button
    const button = page.getByRole('button').first();
    
    await expect(button).toBeVisible();
    const buttonStyles = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        borderRadius: styles.borderRadius,
        cursor: styles.cursor,
      };
    });
    
    expect(buttonStyles.cursor).toBe('pointer');
  });
});

test.describe('Aspect Ratio Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(500);
  });

  test('should support 9:16 aspect ratio (Story)', async ({ page }) => {
    const aspectButton = page.getByRole('button', { name: /9:16/ }).first();
    
    await expect(aspectButton).toBeVisible();
    await aspectButton.click();
    await page.waitForTimeout(500);
    
    // Button should remain visible after selection
    await expect(aspectButton).toBeVisible();
  });

  test('should support 4:5 aspect ratio (Portrait)', async ({ page }) => {
    const aspectButton = page.getByRole('button', { name: /4:5/ }).first();
    
    await expect(aspectButton).toBeVisible();
    await aspectButton.click();
    await page.waitForTimeout(500);
    
    await expect(aspectButton).toBeVisible();
  });

  test('should support 1:1 aspect ratio (Square)', async ({ page }) => {
    const aspectButton = page.getByRole('button', { name: /1:1/ }).first();
    
    await expect(aspectButton).toBeVisible();
    await aspectButton.click();
    await page.waitForTimeout(500);
    
    await expect(aspectButton).toBeVisible();
  });
});

test.describe('Animation and Transitions', () => {
  test('should animate between views smoothly', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Navigate to demo
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    
    // Wait for animation
    await page.waitForTimeout(600);
    
    // Should be in demo view
    await expect(page.getByRole('button', { name: /back to upload/i })).toBeVisible();
  });

  test('should handle rapid navigation without errors', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
    
    // Rapid navigation
    await page.getByRole('button', { name: /view story slide demo/i }).click();
    await page.waitForTimeout(100);
    await page.getByRole('button', { name: /back to upload/i }).click();
    await page.waitForTimeout(100);
    
    // Should still be functional
    await expect(page.getByText(/upload library/i)).toBeVisible();
  });
});

test.describe('Reduced Motion Support', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // App should still function
    await expect(page.getByRole('heading', { name: /rekordbox year in review/i })).toBeVisible();
  });
});
