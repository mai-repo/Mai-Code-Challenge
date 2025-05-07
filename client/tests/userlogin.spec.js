import { test, expect } from '@playwright/test';

test('user should be able to input email and password', async ({ page }) => {
  await page.goto('https://mai-code-challenge.vercel.app');

  await page.route('**/verifyUser', async (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'ReCAPTCHA success' }),
    });
  });

  await page.route('**/authentication/login', async (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'mock-id', uid: 'mock-uid' }),
    });
  });

  await page.locator('#email').fill('test@gmail.com');
  await page.locator('#password').fill('password123');

  await page.evaluate(() => {
    const event = new Event('change');
    const recaptcha = document.querySelector('[aria-labelledby="reCAPTCHA-label"]');
    if (recaptcha) {
      recaptcha.dispatchEvent(event);
    }
  });

  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/challenge/);

});
