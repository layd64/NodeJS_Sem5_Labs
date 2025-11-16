import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    const uniqueId = Date.now();
    const email = `testuser${uniqueId}@example.com`;
    const password = 'password123';
    const name = `Test User ${uniqueId}`;

    test('should register a new user', async ({ page }) => {
        await page.goto('/register');
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.fill('input[value=""]', name); // Name input might need a better selector if value isn't empty initially, but here it is. 
        // Actually, looking at Register.tsx:
        // <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        // It's the only text input that is not email or password.
        await page.fill('input[type="text"]', name);

        await page.click('button[type="submit"]');

        // After registration, it should redirect to home
        await expect(page).toHaveURL('/');

        // And maybe show some user info or logout button?
        // Layout probably has a header with user info.
    });

    test('should login with existing user', async ({ page }) => {
        // We need to register first or assume the user exists. 
        // Since tests might run in parallel or random order, it's safer to register a new user for this test too 
        // OR use the one from previous test if we run serially.
        // Let's create a new one for isolation.
        const loginEmail = `loginuser${uniqueId}@example.com`;

        // Register first (helper function would be nice but inline for now)
        await page.goto('/register');
        await page.fill('input[type="email"]', loginEmail);
        await page.fill('input[type="password"]', password);
        await page.fill('input[type="text"]', name);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/');

        // Now logout to test login
        // Assuming there is a logout button. Let's check Layout later. 
        // For now, let's just clear storage to simulate logout
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        await page.goto('/login');
        await page.fill('input[type="email"]', loginEmail);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/');
    });
});
