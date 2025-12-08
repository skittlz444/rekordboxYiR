import { Page, expect } from '@playwright/test';

/**
 * Helper function to wait for a slide to be visible
 */
export async function waitForSlideVisible(page: Page, slideTestId: string) {
  await expect(page.getByTestId(slideTestId)).toBeVisible({ timeout: 10000 });
}

/**
 * Helper function to navigate through story mode
 * @param page Playwright page
 * @param direction 'next' or 'prev'
 */
export async function navigateStoryMode(page: Page, direction: 'next' | 'prev') {
  const button = direction === 'next' 
    ? page.getByRole('button', { name: /next/i })
    : page.getByRole('button', { name: /previous|prev/i });
  await button.click();
  // Wait for button to become enabled again (animation complete)
  await expect(button).toBeEnabled({ timeout: 2000 });
}

/**
 * Helper function to close story mode overlay
 */
export async function closeStoryMode(page: Page) {
  const closeButton = page.getByRole('button', { name: /close/i }).first();
  await closeButton.click();
  // Wait for close button to disappear (overlay closed)
  await expect(closeButton).not.toBeVisible();
}

/**
 * Helper function to open settings panel
 */
export async function openSettings(page: Page) {
  const settingsButton = page.getByRole('button', { name: /settings/i });
  await settingsButton.click();
  // Wait for settings dialog to appear
  await expect(page.getByRole('dialog').first()).toBeVisible();
}

/**
 * Helper to check if element has specific text
 */
export async function expectTextContent(page: Page, selector: string, text: string | RegExp) {
  await expect(page.locator(selector)).toContainText(text);
}

/**
 * Helper to wait for application to be ready
 */
export async function waitForAppReady(page: Page) {
  await expect(page.getByRole('heading', { name: /rekordbox year in review/i })).toBeVisible();
}
