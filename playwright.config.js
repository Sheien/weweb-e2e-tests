// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration with:
 * - Test directory: ./tests
 * - Headless Chromium (and other browsers if needed)
 * - Auto-start dev server at http://localhost:9323
 * - Screenshots, traces, and video on failure
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 7000,
  },
  fullyParallel: true,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:9323',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // 🔁 Auto-start your dev server if not already running
  webServer: {
    command: 'npm run dev', // Replace with your actual dev command
    url: 'http://localhost:9323',
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },

  // ✅ Named project for --project=chromium
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
