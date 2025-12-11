import { test, expect } from '@playwright/test';

test.describe('Privacy Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display privacy link in header', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await expect(privacyLink).toBeVisible();
  });

  test('should open privacy dialog when header link is clicked', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.click();

    // Check dialog is open with correct title
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: /your data - we don't use it/i })).toBeVisible();
  });

  test('should display privacy link in upload card', async ({ page }) => {
    // The upload container should also have a privacy link
    const uploadCardPrivacyLink = page.getByRole('button', { name: /your data - we don't use it/i }).nth(1);
    await expect(uploadCardPrivacyLink).toBeVisible();
  });

  test('should show prominent summary in dialog', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.click();

    const dialog = page.getByRole('dialog');
    
    // Check for the prominent summary
    await expect(dialog.getByText(/we do not store your database on our servers/i)).toBeVisible();
    await expect(dialog.getByText(/zero access to your music library/i)).toBeVisible();
  });

  test('should display all privacy policy sections', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.click();

    const dialog = page.getByRole('dialog');

    // Check for all key sections
    await expect(dialog.getByText('🔒 No Storage')).toBeVisible();
    await expect(dialog.getByText('🚫 No Access to Your Music')).toBeVisible();
    await expect(dialog.getByText('🔐 Secure Processing')).toBeVisible();
    await expect(dialog.getByText('💾 Client-Side Only')).toBeVisible();
  });

  test('should contain detailed privacy information', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.click();

    const dialog = page.getByRole('dialog');

    // Check for key privacy points
    await expect(dialog.getByText(/never stored/i)).toBeVisible();
    await expect(dialog.getByText(/no way to access your actual music files/i)).toBeVisible();
    await expect(dialog.getByText(/industry-standard encryption/i)).toBeVisible();
    await expect(dialog.getByText(/happen in your browser/i)).toBeVisible();
  });

  test('should close dialog when X button is clicked', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Close the dialog
    const closeButton = dialog.getByRole('button', { name: /close/i });
    await closeButton.click();

    // Dialog should no longer be visible
    await expect(dialog).not.toBeVisible();
  });

  test('should close dialog when clicking outside (on overlay)', async ({ page }) => {
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Click outside the dialog (on the overlay)
    await page.mouse.click(10, 10);

    // Dialog should close
    await expect(dialog).not.toBeVisible();
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Tab to the privacy link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Might need multiple tabs depending on page structure
    
    // Find and focus the privacy link
    const privacyLink = page.getByRole('banner').getByRole('button', { name: /your data - we don't use it/i });
    await privacyLink.focus();
    
    // Press Enter to open
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
