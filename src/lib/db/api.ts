import type { BaseUserRecord, BaseCustomerRecord, BaseAppointmentRecord, AppointmentRecord, CustomerRecord } from '$lib/types';

interface LoginResponse {
	success: boolean;
	message: string;
	data: BaseUserRecord;
}

interface CustomerArrayResponse {
	success: boolean;
	message: string;
	data: CustomerRecord[];
}

interface CustomerResponse {
	success: boolean;
	message: string;
	data: CustomerRecord;
}

interface AppointmentArrayResponse {
	success: boolean;
	message: string;
	data: AppointmentRecord[];
}

interface AppointmentResponse {
	success: boolean;
	message: string;
	data: AppointmentRecord;
}

interface BaseResponse {
	success: boolean;
	message: string;
}

class API {
	private static defaultHeaders = {
		'Content-Type': 'application/json'
	};

	private static async request<T>(endpoint: string, options: RequestInit = {}) {
		try {
			const baseURL = import.meta.env.VITE_API_URL;
			console.log(baseURL);
			const response = await fetch(`${baseURL}/api${endpoint}`, {
				...options,
				headers: {
					...this.defaultHeaders,
					...options.headers
				}
			});

			// Return true for DELETE operations (status 204)
			if (response.status === 204) {
				return true;
			}

			return await response.json();
		} catch (error) {
			console.error('API Request failed:', error);
			throw error;
		}
	}

	static async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
		return this.request<LoginResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials)
		});
	}

	static async signup(data: BaseUserRecord): Promise<BaseResponse> {
		return this.request('/auth/signup', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async updateCustomer(data: BaseCustomerRecord): Promise<BaseResponse> {
		return this.request('/customers/update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async deleteCustomer(id: string): Promise<BaseResponse> {
		return this.request('/customers/delete', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}

	static async createCustomer(data: BaseCustomerRecord): Promise<BaseResponse> {
		return this.request('/customers/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async getCustomers(userid: string): Promise<CustomerArrayResponse> {
		return this.request('/customers/getCustomersByUserID', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	static async getCustomerByID(userid: string): Promise<CustomerResponse> {
		return this.request('/customers/getCustomerByUserID', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	static async getAppointmentsByUserID(userid: string): Promise<AppointmentArrayResponse> {
		return this.request('/appointments/getByUserID', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	static async getAppointmentsByCustomerID(customerid: string): Promise<AppointmentArrayResponse> {
		return this.request('/appointments/getByCustomerID', {
			method: 'POST',
			body: JSON.stringify(customerid)
		});
	}

	static async getAppointmentByID(id: string): Promise<AppointmentResponse> {
		return this.request('/appointments/getByAppointmentID', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}

	static async createAppointment(data: BaseAppointmentRecord): Promise<BaseResponse> {
		return this.request('/appointments/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async updateAppointment(data: AppointmentRecord): Promise<BaseResponse> {
		return this.request('/appointments/update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async deleteAppointment(id: string): Promise<BaseResponse> {
		return this.request('/appointments/delete', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}
}

export default API;
