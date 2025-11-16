import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Adjust this expectation based on the actual title of the app
    await expect(page).toHaveTitle(/frontend/);
});

test('get started link', async ({ page }) => {
    await page.goto('/');

    // This is a placeholder test. 
    // We should replace this with actual selectors from the app once we know them.
    // For now, let's just check if the body is visible to ensure the page loads.
    await expect(page.locator('body')).toBeVisible();
});
