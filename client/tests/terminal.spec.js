import { test, expect } from '@playwright/test';

test('render the answer component', async({page}) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    await expect(page).toHaveTitle(/Mai Code Challenge/)
})


test('render the generate button and mock a scrape', async({page}) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Successfully grabbed the data.');
    });

    await page.getByRole('button', { name: 'Generate', exact: true }).click();

})


test('render the GPT generate button and mock a GPT question', async({page}) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Successfully generate Challenge');
    });

    await page.getByRole('button', { name: 'GPT Generate', exact: true }).click();

})


test('render the clear button and mock clear', async({page}) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    await page.locator('button:has-text("Clear")').toBeVisible
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.locator('p:has-text("Name:")')).not.toBeVisible();
    await expect(page.locator('p:has-text("Challenge:")')).not.toBeVisible();
})


