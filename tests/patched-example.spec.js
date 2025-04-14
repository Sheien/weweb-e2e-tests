import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  await expect(page).toHaveTitle(/WeWeb/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  await expect(page.getByRole('link', { name: /Upload/i })).toBeVisible();
});