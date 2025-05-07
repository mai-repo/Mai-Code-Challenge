import { test, expect } from '@playwright/test';

test('should render the Monaco editor and Run Code button', async ({ page }) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    const editor = page.locator('.monaco-editor');
    const runCodeButton = page.locator('button:has-text("Run Code")');
    await expect(editor).toBeVisible();
    await expect(runCodeButton).toBeVisible();
    });

test('should render the value 1 in the Monaco editor', async ({ page }) => {
    await page.goto('https://mai-code-challenge.vercel.app/challenge');
    const editorLocator = page.locator('.monaco-editor')
    const editorText = await editorLocator.textContent();
    const defaultValue = `1`;
    expect(editorText).toContain(defaultValue);
});
