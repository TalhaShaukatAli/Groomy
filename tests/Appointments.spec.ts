import { test, expect } from '@playwright/test';

test.describe('Create Appointment', async () => {
	const email = 'test@gmail.com';
	const password = 'test123';
	test('existing account', async ({ page }) => {
		await page.goto('http://localhost:4173/');
		await page.getByRole('link', { name: 'Login' }).click();
		await page.getByPlaceholder('Example@gmail.com').click();
		await page.getByPlaceholder('Example@gmail.com').fill(email);
		await page.getByPlaceholder('Example@gmail.com').press('Tab');
		await page.getByPlaceholder('ABC123').fill(password);
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('/home');
		await page.getByRole('link', { name: 'Customers' }).click();
		await expect(page.locator('body')).toContainText('Test@gmail.com');
		await page.getByRole('link', { name: 'View' }).first().click();
	});
});
