import { test, expect } from '@playwright/test';

test.describe('Smart Content URL Save Tests', () => {
  const urls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://tiktok.com/@someuser/video/1234567890',
  ];

  for (const url of urls) {
    test(`Save content from: ${url}`, async ({ page }) => {
      await page.goto('https://bb0be720-0874-441e-b384-b7d7e5dde508.weweb-preview.io/');

      // Paste link in the input field
      const urlInput = page.getByTestId('content-url-input');
      await expect(urlInput).toBeVisible({ timeout: 10000 });
      await urlInput.fill(url);

      // Click the Save button
      const saveButton = page.getByTestId('save-button');
      await expect(saveButton).toBeVisible({ timeout: 5000 });
      await saveButton.click();

      // ✅ Wait for content to appear
      const card = page.locator('[data-testid="content-card"]');
      await expect(card).toHaveCountGreaterThan(0, { timeout: 10000 });

      // Optional: visual proof for debugging
      await page.screenshot({ path: `evidence-url-save-${Date.now()}.png`, fullPage: true });
    });
  }
});
