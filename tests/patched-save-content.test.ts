import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const sampleFolder = path.resolve(__dirname, '../sample-files');

const fileNames = [
  'file-sample-100kB.doc',
  'file-sample-150kB.pdf',
  'file-sample-250kB.jpg',
  'file-sample-1360kb.png',
  'file_example_MP3_700kB.mp3',
  'file_example_MP4_480_1_5MG.mp4',
  'file_example_PPT_250kB.ppt',
  'file_example_XLS_100.xls',
  'Screenshot 2025-04-12 024717.jpg',
];

const filePaths = fileNames
  .map(name => path.join(sampleFolder, name))
  .filter(fullPath => {
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Skipping missing file: ${path.basename(fullPath)}`);
      return false;
    }
    return true;
  });

if (filePaths.length === 0) throw new Error('❌ No valid files found. Aborting tests.');

async function waitForUploadInput(page) {
  const input = page.locator('[data-testid="file-upload"]');
  await expect(input).toHaveCount(1, { timeout: 15000 });
  await expect(input).toBeVisible({ timeout: 10000 });
  return input;
}

async function verifyFileEntry(page, filePath: string) {
  const fileName = path.basename(filePath);
  const fileSizeKB = Math.ceil(fs.statSync(filePath).size / 1024);
  const fileExt = path.extname(fileName).substring(1);

  await expect(page.getByText(fileName)).toBeVisible({ timeout: 7000 });
  await expect(page.getByText(new RegExp(`${fileSizeKB}\\s*(KB|MB)`, 'i'))).toBeVisible();
  await expect(page.getByText(new RegExp(fileExt, 'i'))).toBeVisible();

  const deleteBtn = page.getByRole('button', { name: new RegExp(`delete.*${fileName}`, 'i') });
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await expect(page.getByText(fileName)).not.toBeVisible({ timeout: 5000 });
  }
}

test.describe('📥 File Upload E2E Suite', () => {

  test('Upload files individually with verification and cleanup', async ({ page }) => {
    for (const filePath of filePaths) {
      await page.goto('/');
      await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
      const fileInput = await waitForUploadInput(page);

      await fileInput.setInputFiles(filePath);
      await page.getByRole('button', { name: /upload/i }).click();
      await verifyFileEntry(page, filePath);
    }
  });

  test('Upload all files in bulk and clean up', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    const fileInput = await waitForUploadInput(page);

    await fileInput.setInputFiles(filePaths);
    await page.getByRole('button', { name: /upload/i }).click();

    for (const filePath of filePaths) {
      await verifyFileEntry(page, filePath);
    }
  });

});