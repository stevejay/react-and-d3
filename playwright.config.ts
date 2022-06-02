import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'e2e-tests',
  outputDir: './e2e-tests-results',
  forbidOnly: !!process.env.CI,
  workers: 2,
  retries: 1,
  use: {
    baseURL: 'http://localhost:6006',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'en-US'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
};
export default config;
