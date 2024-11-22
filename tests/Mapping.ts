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
		await this.GoTo("Base")
		await this.page.getByRole('link', { name: 'Login' }).click();
		await this.page.getByPlaceholder('Example@gmail.com').fill(email);
		await this.page.getByPlaceholder('ABC123').fill(password);
		await this.page.getByRole('button', { name: 'Login' }).click();
	}

	async Account_Logout() {
		await this.page.goto('http://localhost:4173/login/logout');
	}

	async Account_Register(firstName: string, lastName: string, email: string, password: string) {
		await this.GoTo("Base")
		await this.page.getByRole('link', { name: 'Login' }).click();
		await this.page.getByRole('button', { name: "Don't have an account? Click" }).click();
		await this.page.getByPlaceholder('FirstName').fill(firstName);
		await this.page.getByPlaceholder('LastName').fill(lastName);
		await this.page.getByPlaceholder('Example@gmail.com').fill(email);
		await this.page.getByPlaceholder('ABC123').fill(password);
		await this.page.getByRole('button', { name: 'Create' }).click();
	}

	async Customer_Create() {
		await this.GoTo("Customers")
		


	}
}
