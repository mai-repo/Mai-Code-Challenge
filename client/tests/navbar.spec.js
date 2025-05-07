import { test, expect } from '@playwright/test';

test('render the page and see the NavBar', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });
    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Sign out')).toBeVisible();
});
