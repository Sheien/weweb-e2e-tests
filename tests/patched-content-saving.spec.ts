import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Smart Content Saving & Organization', () => {
  test('Save and display YouTube video', async ({ page }) => {
    await page.goto('https://b4d4c6a9-f289-454b-af28-fc8cd12f49d2.weweb-preview.io/');
    await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    await page.getByTestId('content-url-input').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('content-list')).toContainText('Rick Astley');
  });

  test('Save PDF and show metadata', async ({ page }) => {
    await page.goto('https://b4d4c6a9-f289-454b-af28-fc8cd12f49d2.weweb-preview.io/');
    await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    const filePath = path.resolve('./sample-files/sample.pdf');
    const fileChooser = await page.waitForEvent('filechooser');
    await page.getByTestId('file-upload').click();
    await fileChooser.setFiles(filePath);
    await expect(page.getByTestId('content-list')).toContainText('sample.pdf');
  });

  test('Reject invalid TikTok link', async ({ page }) => {
    await page.goto('https://b4d4c6a9-f289-454b-af28-fc8cd12f49d2.weweb-preview.io/');
    await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    await page.getByTestId('content-url-input').fill('https://tiktok.com/invalid_url');
    await page.getByTestId('save-button').click();
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('Tag-based filtering works', async ({ page }) => {
    await page.goto('https://b4d4c6a9-f289-454b-af28-fc8cd12f49d2.weweb-preview.io/');
    await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    await page.getByTestId('filter-tag-select').selectOption('YouTube');
    await expect(page.getByTestId('content-list')).toContainText('YouTube');
  });
});