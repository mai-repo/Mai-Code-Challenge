import { test, expect } from '@playwright/test';

test('render the CodeButton component', async({page}) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');

    const generateButton = page.getByRole('button', { name: 'Generate', exact: true })
    await expect(generateButton).toBeVisible();

    const gptGenerateButton = page.getByRole('button', { name: 'GPT Generate', exact: true })
    await expect(gptGenerateButton).toBeVisible();


    const clearButton = page.getByRole('button', { name: 'Clear', exact: true })
    await expect(clearButton).toBeVisible();
});

test('should allow clicking the buttons', async ({ page }) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');

    const generateButton = page.getByRole('button', { name: 'Generate', exact: true })
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    const gptGenerateButton = page.getByRole('button', { name: 'GPT Generate', exact: true })
    await expect(gptGenerateButton).toBeEnabled();
    await gptGenerateButton.click();

    const clearButton = page.getByRole('button', { name: 'Clear', exact: true })
    await expect(clearButton).toBeEnabled();
    await clearButton.click();
});




