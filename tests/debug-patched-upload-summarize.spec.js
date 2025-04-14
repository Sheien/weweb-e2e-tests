import { test, expect } from '@playwright/test';
import path from 'path';

test('Upload and summarize flow works', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  const filePath = path.join('sample-files', 'file-sample-150kB.pdf');
  const fileInput = page.getByTestId('file-upload');
  await fileInput.setInputFiles(filePath);
  console.log(`🧪 Uploading file: ${filePath}`);
  await page.screenshot({ path: `debug-${file}.png`, fullPage: true });
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.waitForTimeout(2000);

  const summary = await page.locator('.summary').innerText();
  expect(summary.length).toBeGreaterThan(10);
});