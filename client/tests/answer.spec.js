import { test, expect } from '@playwright/test';

test('render the answer component', async({page}) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });

    await expect(page.locator('text=Evaluate')).toBeVisible();
    await expect(page.locator('text=Save Question')).toBeVisible();
})

test('mock the a user evaluation', async({page}) => {

    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });

    await page.route('**/evaluteAnswer', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                isCorrect: true,
                breakdown: ['Line 1 correct', 'Line 2 correct']}),
        });
    });

    await page.locator('button:has-text("Evaluate")').click();

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Evaluation successful.');
        await dialog.accept();
    });
})

test('mock the a save question', async({page}) => {

    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });

    await page.route('**/addProblem', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                message: 'Problem added successfully.'
            }),
        });
    });

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Problem added successfully.');
    });

    await page.locator('button:has-text("Save Question")').click();
})

