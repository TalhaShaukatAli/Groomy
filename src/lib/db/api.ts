import type {
	userRecord,
	newCustomerRecord,
	newUserRecord,
	newAppointmentRecord,
	appointmentRecord,
	customerRecord
} from '$lib/types';

interface LoginResponse {
	success: boolean;
	message: string;
	data: userRecord;
}

interface CustomerArrayResponse {
	success: boolean;
	message: string;
	data: customerRecord[];
}

interface CustomerResponse {
	success: boolean;
	message: string;
	data: customerRecord;
}

interface AppointmentArrayResponse {
	success: boolean;
	message: string;
	data: appointmentRecord[];
}

interface AppointmentResponse {
	success: boolean;
	message: string;
	data: appointmentRecord;
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
			console.log(baseURL)
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

	static async createUser(data: newUserRecord): Promise<BaseResponse> {
		return this.request('/auth/createUser', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async saveCustomer(data: newCustomerRecord): Promise<BaseResponse> {
		return this.request('/customers/save', {
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

	static async createCustomer(data: newCustomerRecord): Promise<BaseResponse> {
		return this.request('/customers/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async getCustomers(userid: string): Promise<CustomerArrayResponse> {
		return this.request('/customers/get', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	static async getCustomerByID(userid: string): Promise<CustomerResponse> {
		return this.request('/customers/get/id', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	static async getAppointmentsByUserID(userid: string): Promise<AppointmentArrayResponse> {
		return this.request('/appointments/get/userid', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	static async getAppointmentsByCustomerID(customerid: string): Promise<AppointmentArrayResponse> {
		return this.request('/appointments/get/customerid', {
			method: 'POST',
			body: JSON.stringify(customerid)
		});
	}

	static async getAppointmentByID(id: string): Promise<AppointmentResponse> {
		return this.request('/appointments/get/id', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}

	static async createAppointment(data: newAppointmentRecord): Promise<BaseResponse> {
		return this.request('/appointments/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	static async updateAppointment(data: appointmentRecord): Promise<BaseResponse> {
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
