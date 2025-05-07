import { test, expect } from '@playwright/test';

test('render the register page', async({ page }) => {
    await page.goto("https://mai-code-challenge.vercel.app/authentication/register");
    await expect(page.locator('h1')).toHaveText('Registration');
});
