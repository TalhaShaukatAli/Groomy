import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';

test.describe('Existing Account', async () => {
	let email = 'test@gmail.com';
	let password = 'test123';
	test('Edit existing account', async ({ page }) => {
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
		await expect(page.locator('body')).toContainText(
			'Ethan Henrickson Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:'
		);
		await page.getByRole('button', { name: 'Edit Customer' }).click();
		await page.locator('input[name="lastName"]').click();
		await page.locator('input[name="lastName"]').fill('Henrick');
		await page.locator('input[name="phone"]').click();
		await page.locator('input[name="phone"]').fill('218-123-123');
		await page.locator('input[name="street"]').click();
		await page.locator('input[name="street"]').fill('1234 Fake S');
		await page.locator('input[name="firstName"]').click();
		await page.locator('input[name="firstName"]').fill('Etha');
		await page.locator('input[name="city"]').click();
		await page.locator('input[name="city"]').fill('Bemid');
		await page.getByRole('button', { name: 'Save' }).click();
		await page.getByRole('link', { name: 'View' }).first().click();
		await expect(page.locator('body')).toContainText(
			'Etha Henrick Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:'
		);
		await page.getByRole('button', { name: 'Edit Customer' }).click();
		await page.locator('input[name="lastName"]').click();
		await page.locator('input[name="lastName"]').fill('Henrickson');
		await page.locator('input[name="phone"]').click();
		await page.locator('input[name="phone"]').fill('218-123-1234');
		await page.locator('input[name="street"]').click();
		await page.locator('input[name="street"]').fill('1234 Fake St');
		await page.locator('input[name="firstName"]').click();
		await page.locator('input[name="firstName"]').fill('Ethan');
		await page.locator('input[name="city"]').click();
		await page.locator('input[name="city"]').fill('Bemidji');
		await page.getByRole('button', { name: 'Save' }).click();
		await page.getByRole('link', { name: 'View' }).first().click();
		await expect(page.locator('body')).toContainText(
			'Ethan Henrickson Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:'
		);
	});
});

test.describe('New Account', async () => {
	const FirstName = generateRandomString(10);
	const LastName = generateRandomString(10);
	const Email = generateRandomString(10) + '@gmail.com';
	const Password = generateRandomString(10);

	test('Create and edit customer', async ({ page }) => {
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
		await expect(page.locator('body')).toContainText(
			'Test Test Edit Customer First Name: Last Name: Phone: Email: Street: City: State: Zip Code:'
		);
	});
});
