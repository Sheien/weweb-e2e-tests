import { test, expect } from '@playwright/test';
import path from 'path';

const sampleFiles = [
  'file-sample-150kB.pdf',
  'file-sample-100kB.doc',
  'file-sample-250kb.jpg',
  'file-sample-1360kb.png',
  'file_example_MP3_700KB.mp3',
  'file_example_MP4_480_1_5MG.mp4',
  'file_example_XLS_100.xls',
  'file_example_PPT_250kB.ppt',
];

test('Upload file and verify in Recent Uploads', async ({ page }) => {
  const filename = 'file-sample-150kB.pdf';
  const fullPath = path.join('sample-files', filename);

  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  const fileInput = page.getByTestId('file-upload');
  await fileInput.setInputFiles(fullPath);
  console.log(`🧪 Uploading file: ${filePath}`);
  await page.screenshot({ path: `debug-${file}.png`, fullPage: true });
  await page.getByRole('button', { name: 'Upload' }).click();

  await page.waitForTimeout(2000);

  const recentUploads = await page.locator('.ww-element-text').allTextContents();
  const matched = recentUploads.some(text => text.includes('Documentation') || text.includes(filename));
  expect(matched).toBeTruthy();
});