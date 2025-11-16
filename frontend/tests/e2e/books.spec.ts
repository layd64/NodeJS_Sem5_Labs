import { test, expect } from '@playwright/test';

test.describe('Books Management', () => {
    test('should display books list', async ({ page }) => {
        await page.goto('/books');
        await expect(page.locator('h2')).toHaveText('Каталог книжок');

        // Check if filter form is visible
        await expect(page.locator('.filter-form')).toBeVisible();

        // Check if books grid is visible or "No books found" message
        const booksGrid = page.locator('.books-grid');
        const noBooksMessage = page.getByText('Книжок не знайдено');

        await expect(booksGrid.or(noBooksMessage)).toBeVisible();
    });

    test('should filter books', async ({ page }) => {
        await page.goto('/books');

        // Type in search box
        const searchInput = page.locator('input[placeholder="Назва або автор"]');
        await searchInput.fill('Test Book');

        // Click filter button
        await page.click('button:has-text("Фільтрувати")');

        // Verify URL params
        await expect(page).toHaveURL(/search=Test\+Book/);
    });
});
