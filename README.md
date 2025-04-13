# 🧪 Playwright E2E Test Suite for WeWeb + Xano App

This repository contains end-to-end (E2E) tests for the Smart Content Management App built using [WeWeb](https://www.weweb.io/) and [Xano](https://www.xano.com/). The tests use [Playwright](https://playwright.dev/) to validate core functionalities like content saving, file uploads, and organization across desktop and mobile browsers.

---

## 🚀 Features Tested

- ✅ Upload and save web, YouTube, TikTok, Instagram, blog, email, PDF, and social media content
- ✅ Organize content with tags, filters, categories
- ✅ Validate metadata extraction, file types, sizes, and timestamps
- ✅ Cross-browser and mobile compatibility (Chromium, Firefox, WebKit, iPhone 12, Pixel 5)

---

## 📁 Folder Structure

```bash
.
├── tests/                    # Playwright test files (.spec.ts)
├── sample-files/            # PDFs, images, videos, etc. for uploads
├── playwright.config.js     # Playwright config file
├── playwright-report/       # Test report folder (generated)
├── .github/workflows/       # GitHub Actions CI pipeline
│   └── playwright.yml
ECHO is on.
"# Trigger CI" 
