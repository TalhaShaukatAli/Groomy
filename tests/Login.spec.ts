import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';
import { TestMapping } from './Mapping';

test("Make sure you can't go to protected page", async ({ page }) => {
	const map = new TestMapping(page);
	await map.GoTo('Customers');
	await expect(page).toHaveURL('/login');
});

test.describe('Existing Account', async () => {
	let testEmail = 'test@gmail.com';
	let testPassword = 'test123';
	let firstName = 'Test';
	let lastName = 'Test';


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
	const FirstName = generateRandomString(10);
	const LastName = generateRandomString(10);
	const Email = generateRandomString(10) + '@gmail.com';
	const Password = generateRandomString(10);

	test('Create account', async ({ page }) => {
		const map = new TestMapping(page);

		await map.Account_Register(FirstName, LastName, Email, Password)
		await map.Account_Login(Email, Password)
		await expect(page).toHaveURL('/home');
		await page.goto('http://localhost:4173/');
		await expect(page).toHaveURL('/');
		await page.goto('http://localhost:4173/home');
		await expect(page).toHaveURL('/home');
	});
});
