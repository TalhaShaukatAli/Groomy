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
	private testEmail = 'test@gmail.com';
	private testPassword = 'test123';
	private firstName = 'Test';
	private lastName = 'Test';

	constructor(page: Page) {
		this.page = page;
	}

	async GoTo(route: RouteOption) {
		await this.page.goto(`http://localhost:4173${ROUTE_MAP[route]}`);
	}

	async Account_Login(email: string = this.testEmail, password: string = this.testPassword) {
		await this.page.goto('http://localhost:4173/');
		await this.page.getByRole('link', { name: 'Login' }).click();
		await this.page.getByPlaceholder('Example@gmail.com').click();
		await this.page.getByPlaceholder('Example@gmail.com').fill(email);
		await this.page.getByPlaceholder('Example@gmail.com').press('Tab');
		await this.page.getByPlaceholder('ABC123').fill(password);
		await this.page.getByRole('button', { name: 'Login' }).click();
	}

	async Account_Logout() {
		await this.page.goto('http://localhost:4173/login/logout');
	}

	async Account_Register(firstName: string = this.firstName, lastName: string = this.lastName, email: string = this.testEmail, password: string = this.testPassword) {
		await this.page.goto('http://localhost:4173/');
		await this.page.getByRole('link', { name: 'Login' }).click();
		await this.page.getByPlaceholder('Example@gmail.com').click();
		await this.page.getByPlaceholder('Example@gmail.com').fill(email);
		await this.page.getByPlaceholder('Example@gmail.com').press('Tab');
		await this.page.getByPlaceholder('ABC123').fill(password);
		await this.page.getByRole('button', { name: 'Login' }).click();
	}
}
