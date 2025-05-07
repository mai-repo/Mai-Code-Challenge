import { test, expect } from '@playwright/test';

test('render the page and see userSettings', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings');

    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('New Email')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Reset' }).nth(0)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' }).nth(2)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
});

test('mock the update username', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings');

    await page.route('**/updateUsername', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'User updated successfully.' }),
        });
    });
    await page.getByRole('button', { name: 'Reset' }).first().click();

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('User updated successfully.');
    });
});

test('mock the update password', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings');


    await page.route('**/updatePassword', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ reset_link: 'https://example.com/reset' }),
        });
    });
    await page.getByRole('button', { name: 'Reset' }).nth(1).click();

});

test('mock delete user', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings');


    await page.route('**/deleteUser', async (route) => {
        route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ "message": "undefined"}),
        });
        });

    await page.getByRole('button', { name: 'Delete' }).click();
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('undefined');
    });
});

test('mock change email', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });

    await page.goto('https://mai-code-challenge.vercel.app/userSettings');

    await page.evaluate(() => {
        const mockChangeEmail = (newEmail, currentPassword) => {
            if (newEmail === 'test@gmail.com' && currentPassword === 'CurrentPassword123') {
                return Promise.resolve({
                    message: "Verification email sent to new address. Please check and confirm before the email can be changed."
                });
            }
            return Promise.reject({ message: 'Error updating email.' });
        };

        window.changeEmail = mockChangeEmail;
    });

    await page.getByRole('button', { name: 'Reset' }).nth(2).click();

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Verification email sent to new address. Please check and confirm before the email can be changed.');
        await dialog.accept();
    });

});