import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';
import { TestMapping } from './Mapping';

test.describe('Existing Account', async () => {
	const email = 'test@gmail.com';
	const password = 'test123';
	test('Edit existing account', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login(email, password);
		await page.getByRole('link', { name: 'Customers' }).click();
		await expect(page.locator('body')).toContainText('Ethan Henrickson test@gmail.com 218-123-1234 View Edit Delete');
		await page.getByRole('link', { name: 'View' }).click();
		await expect(page.locator('form')).toContainText('Ethan Henrickson Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:');
		await page.getByRole('button', { name: 'Edit Customer' }).click();
		await page.locator('input[name="firstName"]').click();
		await page.locator('input[name="firstName"]').fill('Etha');
		await page.locator('input[name="state"]').click();
		await page.locator('input[name="state"]').fill('M');
		await page.getByRole('button', { name: 'Save' }).click();
		await page.getByRole('link', { name: 'View' }).click();
		await expect(page.locator('form')).toContainText('Etha Henrickson Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:');
		await page.getByRole('button', { name: 'Edit Customer' }).click();
		await page.locator('input[name="firstName"]').click();
		await page.locator('input[name="firstName"]').fill('Ethan');
		await page.locator('input[name="state"]').click();
		await page.locator('input[name="state"]').fill('MN');
		await page.getByRole('button', { name: 'Save' }).click();
	});
});

test.describe('New Account', async () => {
	const FirstName = generateRandomString(10);
	const LastName = generateRandomString(10);
	const Email = generateRandomString(10) + '@gmail.com';
	const Password = generateRandomString(10);

	test('Create and edit customer', async ({ page }) => {
		const map = new TestMapping(page);

		await map.Account_Register(FirstName, LastName, Email, Password);
		await map.Account_Login(Email, Password);

		await page.getByRole('link', { name: 'Customers' }).click();
		await page.getByRole('link', { name: 'Add New Customer >' }).click();
		await page.locator('input[name="firstName"]').click();
		await page.locator('input[name="firstName"]').fill('Test');
		await page.locator('input[name="lastName"]').click();
		await page.locator('input[name="lastName"]').fill('Test');
		await page.locator('input[name="phone"]').click();
		await page.locator('input[name="phone"]').fill('1234567890');
		await page.locator('input[name="email"]').click();
		await page.locator('input[name="email"]').fill('test@gmail.com');
		await page.locator('input[name="street"]').click();
		await page.locator('input[name="street"]').fill('1234 fish st');
		await page.locator('input[name="city"]').click();
		await page.locator('input[name="city"]').fill('test');
		await page.locator('input[name="state"]').click();
		await page.locator('input[name="state"]').fill('test');
		await page.locator('input[name="zip"]').click();
		await page.locator('input[name="zip"]').fill('10123');
		await page.getByRole('button', { name: 'Create Customer' }).click();
		await page
			.locator('div')
			.filter({ hasText: /^Test Test test@gmail\.com 1234567890 View Edit Delete$/ })
			.getByRole('link')
			.first()
			.click();
		await expect(page.locator('body')).toContainText('Test Test Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:');
	});
});
