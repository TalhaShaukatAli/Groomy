import type {
	BaseCustomerRecord,
	BaseAppointmentRecord,
	AppointmentRecord,
	CustomerRecord,
	BaseNote,
	Note,
	ServiceRecord,
	BaseServiceRecord,
	DatabaseResponse,
	DatabaseDataResponse
} from '$lib/types';

/**
 * API class providing methods for interacting with backend services
 * @remarks
 * This class encapsulates all API calls for managing customers, appointments, services, and notes
 */
class API {
	/**
	 * Default headers for API requests
	 * @private
	 */
	private static defaultHeaders = {
		'Content-Type': 'application/json'
	};

	/**
	 * Generic method to make API requests
	 * @param {string} endpoint - The API endpoint to call
	 * @param {RequestInit} [options={}] - Optional request configuration
	 * @returns {Promise<any>} The parsed JSON response or true for DELETE operations
	 * @throws {Error} If the API request fails
	 * @private
	 */
	private static async request(endpoint: string, options: RequestInit = {}) {
		try {
			const response = await fetch(`/api${endpoint}`, {
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

	//Customer Methods

	/**
	 * Update an existing customer record
	 * @param {BaseCustomerRecord} data - The customer data to update
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of the update
	 */
	static async updateCustomer(data: BaseCustomerRecord): Promise<DatabaseResponse> {
		return this.request('/customers/update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Delete a customer by their ID
	 * @param {number} id - The unique identifier of the customer to delete
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of the deletion
	 */
	static async deleteCustomer(id: number): Promise<DatabaseResponse> {
		return this.request('/customers/delete', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}

	/**
	 * Create a new customer record
	 * @param {BaseCustomerRecord} data - The customer data to create
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of customer creation
	 */
	static async createCustomer(data: BaseCustomerRecord): Promise<DatabaseResponse> {
		return this.request('/customers/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Retrieve all customers for a specific user
	 * @param {number} userid - The ID of the user whose customers to retrieve
	 * @returns {Promise<DatabaseDataResponse<CustomerRecord>>} List of customer records
	 */
	static async getCustomers(userid: number): Promise<DatabaseDataResponse<CustomerRecord>> {
		return this.request('/customers/getCustomersByUserID', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	/**
	 * Retrieve a specific customer by user ID
	 * @param {number} userid - The ID of the user to retrieve customer for
	 * @returns {Promise<DatabaseDataResponse<CustomerRecord[]>>} Customer record(s) matching the user ID
	 */
	static async getCustomerByID(userid: number): Promise<DatabaseDataResponse<CustomerRecord[]>> {
		return this.request('/customers/getCustomerByUserID', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	//Appointment Methods

	/**
	 * Retrieve appointments for a specific user
	 * @param {number} userid - The ID of the user whose appointments to retrieve
	 * @returns {Promise<DatabaseDataResponse<AppointmentRecord[]>>} List of appointment records
	 */
	static async getAppointmentsByUserID(userid: number): Promise<DatabaseDataResponse<AppointmentRecord[]>> {
		return this.request('/appointments/getByUserID', {
			method: 'POST',
			body: JSON.stringify(userid)
		});
	}

	/**
	 * Retrieve appointments for a specific customer
	 * @param {number} customerid - The ID of the customer whose appointments to retrieve
	 * @returns {Promise<DatabaseDataResponse<AppointmentRecord[]>>} List of appointment records
	 */
	static async getAppointmentsByCustomerID(customerid: number): Promise<DatabaseDataResponse<AppointmentRecord[]>> {
		return this.request('/appointments/getByCustomerID', {
			method: 'POST',
			body: JSON.stringify(customerid)
		});
	}

	/**
	 * Retrieve a specific appointment by its ID
	 * @param {number} id - The unique identifier of the appointment
	 * @returns {Promise<DatabaseDataResponse<AppointmentRecord>>} The appointment record
	 */
	static async getAppointmentByID(id: number): Promise<DatabaseDataResponse<AppointmentRecord>> {
		return this.request('/appointments/getByAppointmentID', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}

	/**
	 * Create a new appointment
	 * @param {BaseAppointmentRecord} data - The appointment data to create
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of appointment creation
	 */
	static async createAppointment(data: BaseAppointmentRecord): Promise<DatabaseResponse> {
		return this.request('/appointments/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Update an existing appointment
	 * @param {AppointmentRecord} data - The appointment data to update
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of the update
	 */
	static async updateAppointment(data: AppointmentRecord): Promise<DatabaseResponse> {
		return this.request('/appointments/update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Delete an appointment by its ID
	 * @param {number} id - The unique identifier of the appointment to delete
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of deletion
	 */
	static async deleteAppointment(id: number): Promise<DatabaseResponse> {
		return this.request('/appointments/delete', {
			method: 'POST',
			body: JSON.stringify(id)
		});
	}

	//Service Methods

	/**
	 * Retrieve services for a specific user
	 * @param {number} userID - The ID of the user whose services to retrieve
	 * @returns {Promise<DatabaseDataResponse<ServiceRecord[]>>} List of service records
	 */
	static async getServicesByUserID(userID: number): Promise<DatabaseDataResponse<ServiceRecord[]>> {
		return this.request('/services/getServicesByUserID', {
			method: 'POST',
			body: JSON.stringify(userID)
		});
	}

	/**
	 * Retrieve a specific service by its ID
	 * @param {number} serviceID - The unique identifier of the service
	 * @returns {Promise<DatabaseDataResponse<ServiceRecord>>} The service record
	 */
	static async getServiceByID(serviceID: number): Promise<DatabaseDataResponse<ServiceRecord>> {
		return this.request('/services/getServiceByID', {
			method: 'POST',
			body: JSON.stringify(serviceID)
		});
	}

	/**
	 * Create a new service
	 * @param {BaseServiceRecord} data - The service data to create
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of service creation
	 */
	static async createService(data: BaseServiceRecord): Promise<DatabaseResponse> {
		return this.request('/services/create', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Update an existing service
	 * @param {ServiceRecord} data - The service data to update
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of the update
	 */
	static async updateService(data: ServiceRecord): Promise<DatabaseResponse> {
		return this.request('/services/update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Delete a service by its ID
	 * @param {number} serviceID - The unique identifier of the service to delete
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of deletion
	 */
	static async deleteService(serviceID: number): Promise<DatabaseResponse> {
		return this.request('/services/delete', {
			method: 'POST',
			body: JSON.stringify(serviceID)
		});
	}

	//Note Methods

	/**
	 * Retrieve a specific note by its ID
	 * @param {number} noteID - The unique identifier of the note
	 * @returns {Promise<DatabaseDataResponse<Note>>} The note record
	 */
	static async GetNoteByID(noteID: number): Promise<DatabaseDataResponse<Note>> {
		return this.request('/notes/getNoteByID', {
			method: 'POST',
			body: JSON.stringify(noteID)
		});
	}

	/**
	 * Update an existing note
	 * @param {Note} note - The note data to update
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of the update
	 */
	static async UpdateNoteByID(note: Note): Promise<DatabaseResponse> {
		return this.request('/notes/updateNoteByID', {
			method: 'POST',
			body: JSON.stringify(note)
		});
	}

	/**
	 * Delete a note by its ID
	 * @param {number} noteID - The unique identifier of the note to delete
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of deletion
	 */
	static async DeleteNoteByID(noteID: number): Promise<DatabaseResponse> {
		return this.request('/notes/deleteNoteByID', {
			method: 'POST',
			body: JSON.stringify(noteID)
		});
	}

	//Appointment Notes Methods

	/**
	 * Create a new note for a specific appointment
	 * @param {number} appointmentID - The ID of the appointment to add a note to
	 * @param {BaseNote} data - The note data to create
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of note creation
	 */
	static async createAppointmentNote(appointmentID: number, data: BaseNote): Promise<DatabaseResponse> {
		return this.request('/notes/createAppointmentNote', {
			method: 'POST',
			body: JSON.stringify([appointmentID, data])
		});
	}

	/**
	 * Retrieve notes for a specific appointment
	 * @param {number} appointmentID - The ID of the appointment to retrieve notes for
	 * @returns {Promise<DatabaseDataResponse<Note[]>>} List of note records for the appointment
	 */
	static async getAppointmentNotes(appointmentID: number): Promise<DatabaseDataResponse<Note[]>> {
		return this.request('/notes/getAppointmentNotes', {
			method: 'POST',
			body: JSON.stringify(appointmentID)
		});
	}

	//Customer Notes Methods

	/**
	 * Create a new note for a specific customer
	 * @param {number} customerID - The ID of the customer to add a note to
	 * @param {BaseNote} data - The note data to create
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of note creation
	 */
	static async createCustomerNote(customerID: number, data: BaseNote): Promise<DatabaseResponse> {
		return this.request('/notes/createCustomerNote', {
			method: 'POST',
			body: JSON.stringify([customerID, data])
		});
	}

	/**
	 * Retrieve notes for a specific customer
	 * @param {number} customerID - The ID of the customer to retrieve notes for
	 * @returns {Promise<DatabaseDataResponse<Note[]>>} List of note records for the customer
	 */
	static async getCustomerNotes(customerID: number): Promise<DatabaseDataResponse<Note[]>> {
		return this.request('/notes/getCustomerNotes', {
			method: 'POST',
			body: JSON.stringify(customerID)
		});
	}

	//Service Notes Methods

	/**
	 * Create a new note for a specific service
	 * @param {number} serviceID - The ID of the service to add a note to
	 * @param {BaseNote} data - The note data to create
	 * @returns {Promise<DatabaseResponse>} Response indicating success or failure of note creation
	 */
	static async createServiceNote(serviceID: number, data: BaseNote): Promise<DatabaseResponse> {
		return this.request('/notes/createServiceNote', {
			method: 'POST',
			body: JSON.stringify([serviceID, data])
		});
	}

	/**
	 * Retrieve notes for a specific service
	 * @param {number} serviceID - The ID of the service to retrieve notes for
	 * @returns {Promise<DatabaseDataResponse<Note[]>>} List of note records for the service
	 */
	static async getServiceNotes(serviceID: number): Promise<DatabaseDataResponse<Note[]>> {
		return this.request('/notes/getServiceNotes', {
			method: 'POST',
			body: JSON.stringify(serviceID)
		});
	}
}

export default API;
