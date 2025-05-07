import { test, expect } from '@playwright/test';

test('render the page and see favorite', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/favorite');

    await expect(page.locator('h1:text("Favorite Problems")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeVisible();
});

test('render the page and test getFavorite function', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/favorite');

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

test('render the page and test updateFavorite function', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/favorite');

    await page.route('**/updateFavorite', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Success' }),
        });
    });

    await page.goto('https://mai-code-challenge.vercel.app/userSettings/favorite');

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

test('render the page and test deleteFavorite function', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/favorite');

    await page.route('**/deleteFavorite', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Successfully deleted problem'}),
        });
    });
    await page.getByRole('button', { name: 'Delete' }).first().click();

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Successfully deleted problem');
    });
});

test('clicking on challenge link and naviagte to /challenge', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 12);
        window.localStorage.setItem('uid', 'Fvbr8Bs5S2gVMNELtmace5nzzk33');
    });
    await page.goto('https://mai-code-challenge.vercel.app/userSettings/favorite');

    const challengeLink = page.getByRole('link', { name: /sum of even numbers/i });

    await challengeLink.click();
    await expect(page).toHaveURL(/challenge/);

})

