import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npx serve . -l 3000',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
});
