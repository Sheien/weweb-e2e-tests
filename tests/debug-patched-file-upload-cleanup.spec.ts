import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve('test-results', 'playwright-artifacts');
const sampleFiles = [
  'file-sample-150kB.pdf',
  'file-sample-250kB.jpg',
  'file-sample-1360kB.png',
  'file_example_MP3_700kB.mp3',
];

test.describe('File Upload E2E Suite', () => {
  test('Upload files individually with verification and cleanup', async ({ page }) => {
    for (const file of sampleFiles) {
      const fullPath = path.join('sample-files', file);

      await page.goto('/');
      await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
      const fileInput = await page.getByTestId('file-upload');
      await fileInput.setInputFiles(fullPath);
      console.log(`🧪 Uploading file: ${filePath}`);
      await page.screenshot({ path: `debug-${file}.png`, fullPage: true });
      await page.getByRole('button', { name: /Upload/i }).click();
      await page.waitForTimeout(2000);

      const contentList = await page.getByTestId('content-list').allTextContents();
      const found = contentList.some((text) => text.includes(file));
      expect(found).toBeTruthy();
    }
  });

  test('Upload all files in bulk and clean up', async ({ page }) => {
    const fullPaths = sampleFiles.map((f) => path.join('sample-files', f));

    await page.goto('/');
    await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    const fileInput = await page.getByTestId('file-upload');
    await fileInput.setInputFiles(fullPaths);
    console.log(`🧪 Uploading file: ${filePath}`);
    await page.screenshot({ path: `debug-${file}.png`, fullPage: true });
    await page.getByRole('button', { name: /Upload/i }).click();
    await page.waitForTimeout(2000);

    const contentList = await page.getByTestId('content-list').allTextContents();
    for (const file of sampleFiles) {
      const found = contentList.some((text) => text.includes(file));
      expect(found).toBeTruthy();
    }
  });

  // Clean up test artifacts after each test
  test.afterEach(async () => {
    if (fs.existsSync(uploadDir)) {
      for (const entry of fs.readdirSync(uploadDir)) {
        const entryPath = path.join(uploadDir, entry);
        if (fs.lstatSync(entryPath).isFile()) {
          fs.unlinkSync(entryPath);
        } else {
          fs.rmdirSync(entryPath, { recursive: true });
        }
      }
      fs.rmdirSync(uploadDir, { recursive: true });
    }
  });
});