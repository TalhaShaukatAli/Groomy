import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';
import { TestMapping } from './Mapping';

test("Make sure you can't go to protected page", async ({ page }) => {
	const map = new TestMapping(page);
	await map.GoTo('Customers');
	await expect(page).toHaveURL('/login');
});

test.describe('Existing Account', async () => {
	test('Login Test', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login();
		await expect(page).toHaveURL('/home');
	});

	test('All Routes Accessible', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login();

		await map.GoTo('Base');
		await expect(page).toHaveURL('/');
		await map.GoTo('Home');
		await expect(page).toHaveURL('/home');
		await map.GoTo('Customers');
		await expect(page).toHaveURL('/home/customers');
		await map.GoTo('Appointments');
		await expect(page).toHaveURL('/home/appointments');
	});

	test('Incorrect Password', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login((password = 'sfsdgr'));
		await expect(page.getByText('Incorrect username or password')).toBeVisible();
	});

	test('Incorrect Email', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login((email = 'sfsdgr@gmail.com'));
		await expect(page.getByText('Incorrect username or password')).toBeVisible();
	});

	test('Log Out Test', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login();
		await expect(page).toHaveURL('/home');
		await map.Account_Logout();
		await expect(page).toHaveURL('/');
		await map.GoTo('Home');
		await expect(page).toHaveURL('/login');
	});
});

test.describe('New Account', async () => {
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
		await page.waitForTimeout(5000);
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
});
