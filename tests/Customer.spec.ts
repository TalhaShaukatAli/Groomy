import { test, expect } from '@playwright/test';
import { generateRandomString } from '$lib';
import { TestMapping } from './Mapping';
import { CustomerDataObject, Customers } from './DataObjects';

test.describe('Existing Account', async () => {
	const email = 'test@gmail.com';
	const password = 'test123';
	test('Edit existing account', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login(email, password);
		
		await map.AssertCustomer(CustomerDataObject.YoungProfessional);
		await map.Customer_Edit(CustomerDataObject.YoungProfessional.phone, CustomerDataObject.SuburbanMom)
		await map.AssertCustomer(CustomerDataObject.SuburbanMom);
		await map.Customer_Edit(CustomerDataObject.SuburbanMom.phone, CustomerDataObject.YoungProfessional)
		await map.AssertCustomer(CustomerDataObject.YoungProfessional);

	});

	test('Delete account', async ({ page }) => {
		const map = new TestMapping(page);
		await map.Account_Login(email, password);
		
		await map.Customer_Create(CustomerDataObject.SeniorCustomer);
		await map.AssertCustomer(CustomerDataObject.SeniorCustomer);
		await map.Customer_Delete(CustomerDataObject.SeniorCustomer.phone)
		await map.AssertNotCustomer(CustomerDataObject.YoungProfessional);
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

		await map.Customer_Create(CustomerDataObject.BasicFemale);
		await map.AssertCustomer(CustomerDataObject.BasicFemale);

		await map.Customer_Edit(CustomerDataObject.BasicFemale.phone, CustomerDataObject.BasicMale);
		await map.AssertCustomer(CustomerDataObject.BasicMale)
	});
});
