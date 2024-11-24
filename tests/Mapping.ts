import type { BaseCustomerRecord } from '$lib/types';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const ROUTE_MAP = {
	Base: '/',
	Login: '/login',
	Home: '/home',
	Customers: '/home/customers',
	Appointments: '/home/appointments'
} as const;

// Extract the keys for type hinting
type RouteOption = keyof typeof ROUTE_MAP;

export class TestMapping {
	private page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async GoTo(route: RouteOption) {
		await this.page.goto(`http://localhost:4173${ROUTE_MAP[route]}`);
	}

	async Account_Login(email: string, password: string) {
		await this.GoTo('Base');
		await this.page.getByRole('link', { name: 'Login' }).click();
		await this.page.getByPlaceholder('Example@gmail.com').fill(email);
		await this.page.getByPlaceholder('ABC123').fill(password);
		await this.page.getByRole('button', { name: 'Login' }).click();
	}

	async Account_Logout() {
		await this.page.goto('http://localhost:4173/login/logout');
	}

	async Account_Register(firstName: string, lastName: string, email: string, password: string) {
		await this.GoTo('Base');
		await this.page.getByRole('link', { name: 'Login' }).click();
		await this.page.getByRole('button', { name: "Don't have an account? Click" }).click();
		await this.page.getByPlaceholder('FirstName').fill(firstName);
		await this.page.getByPlaceholder('LastName').fill(lastName);
		await this.page.getByPlaceholder('Example@gmail.com').fill(email);
		await this.page.getByPlaceholder('ABC123').fill(password);
		await this.page.getByRole('button', { name: 'Create' }).click();
	}

	async Customer_Create(customerRecord: BaseCustomerRecord) {
		await this.GoTo('Customers');
		await this.page.getByRole('link', { name: 'Add New Customer >' }).click();
		await this.page.locator('input[name="firstName"]').fill(customerRecord.firstName);
		await this.page.locator('input[name="lastName"]').fill(customerRecord.lastName);
		await this.page.locator('input[name="phone"]').fill(customerRecord.phone);
		await this.page.locator('input[name="email"]').fill(customerRecord.email);
		await this.page.locator('input[name="street"]').fill(customerRecord.address.street);
		await this.page.locator('input[name="city"]').fill(customerRecord.address.city);
		await this.page.locator('input[name="state"]').fill(customerRecord.address.state);
		await this.page.getByRole('spinbutton').fill(`${customerRecord.address.zip}`);
		await this.page.getByRole('button', { name: 'Create Customer' }).click();
	}

	async Customer_Edit(oldCustomerPhone: string, customerRecord: BaseCustomerRecord) {
		await this.GoTo('Customers');
		await this.page.locator('.row').filter({ hasText: oldCustomerPhone }).getByText('Edit').click();
		await this.page.locator('input[name="firstName"]').fill(customerRecord.firstName);
		await this.page.locator('input[name="lastName"]').fill(customerRecord.lastName);
		await this.page.locator('input[name="phone"]').fill(customerRecord.phone);
		await this.page.locator('input[name="email"]').fill(customerRecord.email);
		await this.page.locator('input[name="street"]').fill(customerRecord.address.street);
		await this.page.locator('input[name="city"]').fill(customerRecord.address.city);
		await this.page.locator('input[name="state"]').fill(customerRecord.address.state);
		await this.page.getByRole('spinbutton').fill(`${customerRecord.address.zip}`);
		await this.page.getByRole('button', { name: 'Save' }).click();
	}

	async Customer_Delete(customerPhone: string){
		await this.GoTo('Customers');
		await this.page.on('dialog', dialog => dialog.accept());
		await this.page.locator('.row').filter({ hasText: customerPhone }).getByText('Delete').click();

	}

	async AssertCustomer(customerRecord: BaseCustomerRecord) {
		await this.GoTo('Customers');
		await this.page.locator('.row').filter({ hasText: customerRecord.phone }).getByText('View').click();
		await expect(this.page.locator('input[name="firstName"]')).toHaveValue(customerRecord.firstName);
		await expect(this.page.locator('input[name="lastName"]')).toHaveValue(customerRecord.lastName);
		await expect(this.page.locator('input[name="phone"]')).toHaveValue(customerRecord.phone);
		await expect(this.page.locator('input[name="email"]')).toHaveValue(customerRecord.email);
		await expect(this.page.locator('input[name="street"]')).toHaveValue(customerRecord.address.street);
		await expect(this.page.locator('input[name="city"]')).toHaveValue(customerRecord.address.city);
		await expect(this.page.locator('input[name="state"]')).toHaveValue(customerRecord.address.state);
		await expect(this.page.getByRole('spinbutton')).toHaveValue(`${customerRecord.address.zip}`);
	}

	async AssertNotCustomer(customerRecord: BaseCustomerRecord) {
		await this.GoTo('Customers');
		expect(this.page.locator('.row').filter({ hasText: customerRecord.phone })).toBeNull
		
	}
}
