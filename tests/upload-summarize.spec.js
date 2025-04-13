import { test, expect } from '@playwright/test';
import path from 'path';

test('Upload and summarize flow works', async ({ page }) => {
  await page.goto('/');
  const filePath = path.join('sample-files', 'file-sample-150kB.pdf');
  const fileInput = page.getByTestId('file-upload');
  await fileInput.setInputFiles(filePath);
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.waitForTimeout(2000);

  const summary = await page.locator('.summary').innerText();
  expect(summary.length).toBeGreaterThan(10);
});
