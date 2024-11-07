import { test, expect } from '@playwright/test';

test.describe('Create Appointment', async () => {
	let email = 'test@gmail.com';
	let password = 'test123';
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
