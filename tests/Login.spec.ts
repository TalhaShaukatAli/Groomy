import { test, expect } from '@playwright/test';

test("Make sure you can't go to protected page", async ({ page }) => {
	await page.goto('http://localhost:4173/home');
	await expect(page).toHaveURL('/login');
});

test('Login Test', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByRole('link', { name: 'Login' }).click();
	await page.getByPlaceholder('Example@gmail.com').click();
	await page.getByPlaceholder('Example@gmail.com').fill('henricksonethan@gmail.com');
	await page.getByPlaceholder('Example@gmail.com').press('Tab');
	await page.getByPlaceholder('ABC123').fill('123123');
	await page.getByRole('button', { name: 'Login' }).click();
	await expect(page).toHaveURL('/home');
	await page.goto('http://localhost:4173/');
	await expect(page).toHaveURL('/');
	await page.goto('http://localhost:4173/home');
	await expect(page).toHaveURL('/home');
});

test('Log Out Test', async ({ page }) => {
	await page.goto('http://localhost:4173/login');
	await page.getByPlaceholder('Example@gmail.com').click();
	await page.getByPlaceholder('Example@gmail.com').fill('henricksonethan@gmail.com');
	await page.getByPlaceholder('Example@gmail.com').press('Tab');
	await page.getByPlaceholder('ABC123').fill('123123');
	await page.getByRole('button', { name: 'Login' }).click();
	await expect(page).toHaveURL('/home');
	await page.getByRole('link', { name: 'Log Out' }).click();
	await expect(page).toHaveURL('/');
	await page.goto('http://localhost:4173/home');
	await expect(page).toHaveURL('/login');
});
