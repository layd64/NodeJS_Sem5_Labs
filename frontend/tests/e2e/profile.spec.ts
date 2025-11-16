import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
    const uniqueId = Date.now();
    const email = `profileuser${uniqueId}@example.com`;
    const password = 'password123';
    const name = `Profile User ${uniqueId}`;

    test.beforeEach(async ({ page }) => {
        // Register a new user before each test
        await page.goto('/register');
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.fill('input[type="text"]', name);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/');
    });

    test('should display user profile', async ({ page }) => {
        await page.goto('/profile');

        // Check if profile section is visible
        await expect(page.locator('#profile-section')).toBeVisible();

        // Check if user name and email are displayed
        await expect(page.locator('text=' + name)).toBeVisible();
        await expect(page.locator('text=' + email)).toBeVisible();

        // Check other sections
        await expect(page.locator('#saved-books-section')).toBeVisible();
        await expect(page.locator('#reviews-section')).toBeVisible();
    });

    test('should redirect to login if not authenticated', async ({ page }) => {
        // Logout first
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        await page.goto('/profile');

        // Should show message to login
        await expect(page.locator('text=Будь ласка, увійдіть')).toBeVisible();
        // Or check for link to login
        await expect(page.locator('section p a[href="/login"]')).toBeVisible();
    });
});
