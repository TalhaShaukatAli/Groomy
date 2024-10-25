import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';

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

test('Incorrect Password', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByRole('link', { name: 'Login' }).click();
	await page.getByPlaceholder('Example@gmail.com').click();
	await page.getByPlaceholder('Example@gmail.com').fill('henricksonethan@gmail.com');
	await page.getByPlaceholder('Example@gmail.com').press('Tab');
	await page.getByPlaceholder('ABC123').fill('1233');
	await page.getByRole('button', { name: 'Login' }).click();
	await expect(page.getByText("Incorrect username or password")).toBeVisible()
});

test('Incorrect Email', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByRole('link', { name: 'Login' }).click();
	await page.getByPlaceholder('Example@gmail.com').click();
	await page.getByPlaceholder('Example@gmail.com').fill('henricksonehan@gmail.com');
	await page.getByPlaceholder('Example@gmail.com').press('Tab');
	await page.getByPlaceholder('ABC123').fill('123123');
	await page.getByRole('button', { name: 'Login' }).click();
	await expect(page.getByText("Incorrect username or password")).toBeVisible()
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

const FirstName = generateRandomString(10);
const LastName = generateRandomString(10);
const Email = generateRandomString(10) + '@gmail.com';
const Password = generateRandomString(10);

test('Create account', async ({ page }) => {
	await page.goto('http://localhost:4173/login');
	await page.getByRole('button', { name: "Don't have an account? Click" }).click();
	await page.getByPlaceholder('FirstName').click();
	await page.getByPlaceholder('FirstName').fill(FirstName);
	await page.getByPlaceholder('FirstName').press('Tab');
	await page.getByPlaceholder('LastName').fill(LastName);
	await page.getByPlaceholder('LastName').press('Tab');
	await page.getByPlaceholder('Example@gmail.com').fill(Email);
	await page.getByPlaceholder('Example@gmail.com').press('Tab');
	await page.getByPlaceholder('ABC123').fill(Password);
	await page.getByRole('button', { name: 'Create' }).click();
	await page.waitForTimeout(5000)
	await page.getByPlaceholder('Example@gmail.com').click();
	await page.getByPlaceholder('Example@gmail.com').fill(Email);
	await page.getByPlaceholder('Example@gmail.com').press('Tab');
	await page.getByPlaceholder('ABC123').fill(Password);
	await page.getByRole('button', { name: 'Login' }).click();
	await expect(page).toHaveURL('/home');
	await page.goto('http://localhost:4173/');
	await expect(page).toHaveURL('/');
	await page.goto('http://localhost:4173/home');
	await expect(page).toHaveURL('/home');
});
