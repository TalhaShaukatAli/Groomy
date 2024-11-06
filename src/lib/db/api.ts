import type { userRecord, newCustomerRecord, newUserRecord, newAppointmentRecord, appointmentRecord } from '$lib/types';

interface LoginResponse {
	success: boolean;
	message: string;
	data: userRecord;
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

    static async getAppointmentsByUserID(userid: string){
        return this.request('/appointments/get/userid', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
    }

    static async getAppointmentsByCustomerID(customerid: string){
        return this.request('/appointments/get/customerid', {
			method: 'POST',
			body: JSON.stringify(customerid)
		});
    }

    static async getAppointmentByID(id: string){
        return this.request('/appointments/get/id', {
			method: 'POST',
			body: JSON.stringify(id)
		});
    }

    static async createAppointment(data: newAppointmentRecord){
        return this.request('/appointments/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
    }

    static async updateAppointment(data: appointmentRecord){
        return this.request('/appointments/update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
    }

    static async deleteAppointment(id: string){
        return this.request('/appointments/delete', {
			method: 'POST',
			body: JSON.stringify(id)
		});
    }
}

export default API;
