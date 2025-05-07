import { test, expect } from '@playwright/test';

test('render the page and see rejected', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/rejected');

    await expect(page.locator('h1:text("Rejected Problems")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeVisible();
});

test('render the page and test getRejected function', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/rejected');

    await page.route('**/getFavorite*', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Success' }),
        });
    });

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Success');
        await dialog.accept();
    });
});

test('render the page and test updateRejected function', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/rejected');

    await page.route('**/updateRejected', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Success' }),
        });
    });

    await page.goto('https://mai-code-challenge.vercel.app/userSettings/rejected');

    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.getByPlaceholder('Enter new name').fill('New Challenge Name');

    await Promise.all([
        page.waitForEvent('dialog').then(async (dialog) => {
            expect(dialog.message()).toBe('Success');
            await dialog.accept();
        }),
        page.getByRole('button', { name: 'Save' }).first().click(),
    ]);
});

test('render the page and test deleteRejected function', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/rejected');

    await page.route('**/deleteRejected', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Successfully deleted problem'}),
        });
    });

    await page.getByRole('button', { name: 'Delete' }).first().click();
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Successfully deleted problem');
        await dialog.accept();
    });
});


test('clicking on challenge link and naviagte to /challenge', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/rejected');

    const challengeLink = page.getByRole('link', { name: /odd array/i });

    await challengeLink.click();
    await expect(page).toHaveURL(/challenge/);

})
