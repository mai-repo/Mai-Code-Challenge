import { test, expect } from '@playwright/test';

test('render the register page', async({ page }) => {
    await page.goto("https://mai-code-challenge.vercel.app/authentication/register");
    await expect(page.locator('h1')).toHaveText('Registration');

});

test ('user register', async({page}) => {
    await page.goto("https://mai-code-challenge.vercel.app/authentication/register");
    const email = 'ttmai@my.loyno.edu';
    const password = 'password123';
    const name = 'Mai';

    await page.locator('#email').fill("ttmai@my.loyno.edu");
    await page.locator('#password').fill('password123');
    await page.locator('#name').fill('Mai');
    await page.locator('button[type="submit"]').click();

    await page.route('**/authentication/createUser', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ email, name, password}),
        });
    });

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('User created');
        await dialog.accept();
    });
} )