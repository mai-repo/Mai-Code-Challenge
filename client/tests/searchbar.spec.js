import { test, expect } from '@playwright/test';

test('render the search bar', async({page}) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });
    await page.goto("https://mai-code-challenge.vercel.app/userSettings/search")
    const searchBar = page.locator('#search');
    await expect(searchBar).toBeVisible();
})

test('search', async({page}) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('id', 11);
        window.localStorage.setItem('uid', 'rdy3uoxalfcW2KQtvLn0zZ12pvm2');
    });

    await page.route('**/searchQuestions*', async (route) => {
        const mockResponse = {
            data: [
                [50, 12, "array problem", "write a function that takes an array of numbers as input and returns a new array containing only the even numbers."],
                [53, 12, "array, array, array", "create a function that takes in an array of integers and returns a new array containing only the even numbers."]
            ]
        };
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockResponse)
        });
    });

    await page.goto("https://mai-code-challenge.vercel.app/userSettings/search")
    await expect(page.locator('#search')).toBeVisible();
    await page.fill('#search', 'array problem');
    await page.click('button[type="submit"]');

    const resultTitles = page.locator('h2');
    await expect(resultTitles).toBeVisible();
    const resultText = await resultTitles.allTextContents();
    expect(resultText).toContain('array problem');

})

