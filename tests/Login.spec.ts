import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';
import { TestMapping } from './Mapping';

test("Make sure you can't go to protected page", async ({ page }) => {
	const map = new TestMapping(page);
	await map.GoTo('Customers');
	await expect(page).toHaveURL('/login');
});

test.describe('Existing Account', async () => {
	const testEmail = 'test@gmail.com';
	const testPassword = 'test123';

	test('Login Test', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login(testEmail, testPassword);
		await expect(page).toHaveURL('/home');
	});

	test('All Routes Accessible', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login(testEmail, testPassword);

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
		await map.Account_Login(testEmail, 'sfsdgr');
		await expect(page.getByText('Incorrect username or password')).toBeVisible();
	});

	test('Incorrect Email', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login('sfsdgr@gmail.com', testPassword);
		await expect(page.getByText('Incorrect username or password')).toBeVisible();
	});

	test('Log Out Test', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login(testEmail, testPassword);

		await expect(page).toHaveURL('/home');
		await map.Account_Logout();
		await expect(page).toHaveURL('/');
		await map.GoTo('Home');
		await expect(page).toHaveURL('/login');
	});
});

test.describe('New Account', async () => {
	const testData = {
		firstName: generateRandomString(10),
		lastName: generateRandomString(10),
		email: generateRandomString(10) + '@gmail.com',
		password: generateRandomString(10)
	};

	test('Create account', async ({ page }) => {
		const map = new TestMapping(page);

		await map.Account_Register(testData.firstName, testData.lastName, testData.email, testData.password);
		await page.waitForTimeout(1000);

		await map.Account_Login(testData.email, testData.password);
		await expect(page).toHaveURL('/home');
		await page.goto('http://localhost:4173/');
		await expect(page).toHaveURL('/');
		await page.goto('http://localhost:4173/home');
		await expect(page).toHaveURL('/home');
	});
});
