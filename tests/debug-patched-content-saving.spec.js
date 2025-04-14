import { test, expect } from '@playwright/test';
import path from 'path';

const files = [
  'file-sample-1360kb.png',
  'file-sample-150kB.pdf',
  'file-sample-250kb.jpg',
  'file-sample-100kB.doc',
  'file_example_MP3_700KB.mp3',
  'file_example_MP4_480_1_5MG.mp4',
  'file_example_PPT_250kB.ppt',
  'file_example_XLS_100.xls',
  'Screenshot 2025-04-12 024717.jpg',
];

test.describe('Upload Test', () => {
  for (const file of files) {
    test(`Upload file: sample-files/${file}`, async ({ page }) => {
      const filePath = path.join('sample-files', file);
      const baseName = file.split('.')[0];

      await page.goto('/');
      await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
      const fileInput = page.getByTestId('file-upload');
      await fileInput.setInputFiles(filePath);
      console.log(`🧪 Uploading file: ${filePath}`);
      await page.screenshot({ path: `debug-${file}.png`, fullPage: true });

      await page.getByRole('button', { name: /Upload/i }).click();
      await page.waitForTimeout(2000);

      const uploadCard = page.locator('.ww-front-state', { hasText: baseName });
      await expect(uploadCard).toBeVisible({ timeout: 5000 });

      const metadata = await uploadCard.locator('.ww-element-text').allTextContents();
      console.log(`🧾 Metadata for ${file}:`, metadata.join(' | '));

      expect(metadata.join(' ')).toMatch(/MB|KB/);
      expect(metadata.join(' ')).toMatch(/\.(png|pdf|jpg|doc|mp3|mp4|ppt|xls)/);
      expect(metadata.join(' ')).toMatch(/ago|second|min/);

      await page.screenshot({ path: `success-${file}.png`, fullPage: false });
    });
  }
});