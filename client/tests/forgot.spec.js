import { test, expect } from '@playwright/test';

test('renders the page and the forgot', async ({ page }) => {
    await page.goto("https://mai-code-challenge.vercel.app/authentication/forgot");
    await page.locator('#email').fill('test@gmail.com');
    await expect(page).toHaveTitle(/Mai Code Challenge/)
    await page.getByRole('button', { name: 'Submit'}).click()
    await expect(page.locator('label')).toContainText('Email');
})