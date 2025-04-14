import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const dir = 'test-results';
const dragFolder = 'sample-files/drag-folder';
const files = [
  'file_example_MP3_700KB.mp3',
  'file_example_MP4_480_1_5MG.mp4',
  'file_example_XLS_100.xls',
  'file-sample-100kB.doc',
  'file-sample-150kB.pdf',
  'file-sample-250kb.jpg',
  'file-sample-1360kb.png'
];

const MAX_UPLOAD_LIMIT = 5; // Configurable upload limit

function cleanTestResults() {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      fs.unlinkSync(path.join(dir, file));
    });
  } else {
    fs.mkdirSync(dir);
  }
}

test.beforeAll(() => {
  cleanTestResults();
});

test.describe('Upload and verify each file individually', () => {
  for (const filename of files) {
    test(`Upload and verify: ${filename}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      const before = await page.locator('.ww-element-text').count();
      const filePath = path.join('sample-files', filename);

      await page.locator('input[type="file"]').setInputFiles(filePath);
      await page.getByRole('button', { name: 'Upload' }).click();
      await page.waitForTimeout(2000);

      const after = await page.locator('.ww-element-text').count();

      await page.screenshot({
        path: `${dir}/after-upload-${filename}.png`,
        fullPage: true
      });

      expect(after).toBeGreaterThan(before);

      // Metadata validation
      await expect(page.getByText(filename)).toBeVisible();
      const sizeText = await page.locator('.file-size').textContent();
      const typeText = await page.locator('.file-type').textContent();
      expect(sizeText).toMatch(/MB|KB/);
      expect(typeText).toMatch(/image\//i);

      // Tag editing/entry
      const tagInput = page.locator('input[name="tags"]');
      if (await tagInput.isVisible()) {
        await tagInput.fill('TestTag');
        await expect(tagInput).toHaveValue('TestTag');
      }

      // Progress indicator (real-time feedback)
      const progressBar = page.locator('.upload-progress');
      await expect(progressBar).toBeVisible();
      await expect(progressBar).toHaveAttribute('value', /100|1/); // complete

      // Optional cancel button behavior (if exists)
      const cancelButton = page.locator('.upload-cancel');
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await expect(cancelButton).toBeHidden();
      }
    });
  }
});

test('Upload multiple files in one shot', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  const before = await page.locator('.ww-element-text').count();
  const filePaths = files.map(f => path.join('sample-files', f));

  await page.locator('input[type="file"]').setInputFiles(filePaths);
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.waitForTimeout(3000);

  const after = await page.locator('.ww-element-text').count();
  await page.screenshot({
    path: `${dir}/after-multi-upload.png`,
    fullPage: true
  });

  expect(after).toBeGreaterThan(before);
});

test('Drag and drop upload', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  const before = await page.locator('.ww-element-text').count();
  const filePath = path.join('sample-files', 'file-sample-150kB.pdf');

  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await page.setInputFiles('input[type="file"]', filePath);
  await page.dispatchEvent('input[type="file"]', 'drop', { dataTransfer });
  await page.getByRole('button', { name: 'Upload' }).click();

  await page.waitForTimeout(2000);
  const after = await page.locator('.ww-element-text').count();

  await page.screenshot({
    path: `${dir}/after-drag-drop-upload.png`,
    fullPage: true
  });

  expect(after).toBeGreaterThan(before);
});

test('Upload all files from drag folder automatically', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  const dragFiles = fs.readdirSync(dragFolder).map(f => path.join(dragFolder, f));
  const before = await page.locator('.ww-element-text').count();

  await page.locator('input[type="file"]').setInputFiles(dragFiles);
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.waitForTimeout(3000);

  const after = await page.locator('.ww-element-text').count();
  await page.screenshot({ path: `${dir}/after-drag-folder-upload.png`, fullPage: true });

  expect(after).toBeGreaterThan(before);
});

test(`Enforce max upload limit (${MAX_UPLOAD_LIMIT})`, async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  const bigFileList = Array(MAX_UPLOAD_LIMIT + 2).fill(files[0]);
  const filePaths = bigFileList.map((f, i) => path.join('sample-files', f));

  await page.locator('input[type="file"]').setInputFiles(filePaths);
  await page.getByRole('button', { name: 'Upload' }).click();

  // Upload limit enforcement UI check
  const limitMessage = page.locator('.upload-limit-error');
  await expect(limitMessage).toBeVisible();
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`❌ FAILED: ${testInfo.title}`);
    console.log(`→ Expected: ${testInfo.expectedStatus}, Got: ${testInfo.status}`);
    console.log(`→ Output saved to: ${testInfo.outputDir}`);
  }
});