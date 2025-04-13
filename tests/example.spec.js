import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/WeWeb/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Upload/i })).toBeVisible();
});
