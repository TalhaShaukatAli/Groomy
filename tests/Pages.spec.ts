import { test, expect } from '@playwright/test';

test('Reach All Marketing Pages', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await expect(page).toHaveURL('');
	await page.getByRole('link', { name: 'About' }).click();
	await expect(page).toHaveURL('/about');
	await page.getByRole('link', { name: 'Login' }).click();
	await expect(page).toHaveURL('/login');
});
