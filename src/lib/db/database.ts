import type {
	cookie,
	CustomerRecord,
	BaseUserRecord,
	BaseAppointmentRecord,
	AppointmentRecord,
	UserRecord,
	Note,
	BaseNote,
	ServiceRecord,
	BaseServiceRecord,
	DatabaseResponse,
	DatabaseDataResponse
} from '$lib/types';

import Database from 'better-sqlite3';

type DatabaseCustomerResponse = {
	id: number;
	userID: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address_street: string;
	address_city: string;
	address_state: string;
	address_zip: number;
	deleted: number;
};

type DatabaseAppointmentResponse = {
	id: number;
	userID: number;
	customerID: number;
	title: string;
	description: string;
	address_street: string;
	address_city: string;
	address_state: string;
	address_zip: number;
	time_date: string;
	time_start: string;
	time_end: string;
	time_exact: number;
	deleted: number;
};

/**
 * Base class for database services providing a singleton database connection
 * @remarks
 * Ensures a single database instance is used across all service instances
 */
class BaseDatabaseService {
	/** The database connection instance */
	protected db: Database.Database;
	/** Singleton database instance */
	private static dbInstance: Database.Database | null = null;

	constructor() {
		// Check if database instance is null and create if necessary
		if (!BaseDatabaseService.dbInstance) {
			try {
				// Create a new database connection
				BaseDatabaseService.dbInstance = new Database('mydb.sqlite', { verbose: console.log });
				BaseDatabaseService.dbInstance.prepare('PRAGMA journal_mode = WAL').run();
			} catch (error) {
				console.error('Database initialization failed:', error);
				throw error;
			}
		}
		// Set database to the single db instance
		this.db = BaseDatabaseService.dbInstance;
	}
}

/**
 * Service for handling user authentication and cookie management
 * @extends BaseDatabaseService
 */
class AuthService extends BaseDatabaseService {
	constructor() {
		super();
	}

	/**
	 * Create a new user in the database
	 * @param {BaseUserRecord} user - The user record to create
	 * @returns {DatabaseResponse} Response indicating success or failure of user creation
	 */
	createUser(user: BaseUserRecord): DatabaseResponse {
		const existingUser = this.getUserByEmail(user.email);
		if (existingUser.success) {
			return {
				success: false,
				message: 'Email already in use'
			};
		}
		const query = this.db.prepare('Insert into users (firstName, lastName, email, hashedPassword, deleted) VALUES (@firstName, @lastName, @email, @hashedPassword, @deleted)');
		const result = query.run({ firstName: user.firstName, lastName: user.lastName, email: user.email, hashedPassword: user.hashedPassword, deleted: 0 });
		if (result.changes == 1) {
			return {
				success: true,
				message: 'User was created successfully'
			};
		} else {
			console.error('Failed cookie creation - BaseUserRecord:', user);
			return {
				success: false,
				message: 'User creation failed'
			};
		}
	}

	/**
	 * Retrieve a user by their email address
	 * @param {string} email - The email address to search for
	 * @returns {DatabaseDataResponse<UserRecord>} The user record if found
	 */
	getUserByEmail(email: string): DatabaseDataResponse<UserRecord> {
		const query = this.db.prepare('Select * from users WHERE email = ?');
		const result = <UserRecord | null>query.get(email);
		if (result) {
			return {
				success: true,
				message: 'User was retrieved successfully',
				data: result
			};
		} else {
			return {
				success: false,
				message: "Couldn't find user"
			};
		}
	}

	/**
	 * Create a new authentication cookie for a user
	 * @param {string} cookieID - The unique identifier for the cookie
	 * @param {number} userID - The ID of the user the cookie belongs to
	 * @returns {DatabaseResponse} Response indicating success or failure of cookie creation
	 */
	createCookie(cookieID: string, userID: number): DatabaseResponse {
		const query = this.db.prepare('Insert into cookie (id, userID, expireTime) values (@id, @userID, @expireTime)');
		const result = query.run({
			id: cookieID,
			userID: userID,
			expireTime: Date.now() + 60 * 60 * 1000 // Cookie expires in 1 hour
		});
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Successful cookie creation'
			};
		} else {
			console.error('Failed cookie creation - UserID:', userID);
			return {
				success: false,
				message: 'Failed cookie creation'
			};
		}
	}

	/**
	 * Remove a specific cookie from the database
	 * @param {string} id - The unique identifier of the cookie to remove
	 * @returns {DatabaseResponse} Response indicating success or failure of cookie deletion
	 */
	removeCookie(id: string): DatabaseResponse {
		const query = this.db.prepare('DELETE FROM cookie WHERE id = ?');
		const result = query.run(id);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Successful cookie deletion'
			};
		} else {
			console.error('Failed to remove cookie - userID:', id);
			return {
				success: false,
				message: 'Failed cookie deletion'
			};
		}
	}

	/**
	 * Retrieve a cookie by its ID
	 * @param {string} userID - The ID of the cookie to retrieve
	 * @returns {DatabaseDataResponse<cookie>} The cookie record if found
	 */
	getCookie(userID: string): DatabaseDataResponse<cookie> {
		const query = this.db.prepare('Select * from cookie WHERE id = ?');
		const result = <cookie | null>query.get(userID);
		if (result) {
			return {
				success: true,
				message: 'Found cookie successfully',
				data: result
			};
		} else {
			console.error('Failed cookie finding - userID:', userID);
			return {
				success: false,
				message: 'Failed to find cookie'
			};
		}
	}

	/**
	 * Update the expiration time of a specific cookie
	 * @param {string} cookieID - The unique identifier of the cookie to update
	 * @returns {DatabaseResponse} Response indicating success or failure of cookie update
	 */
	updateCookie(cookieID: string): DatabaseResponse {
		const query = this.db.prepare('Update cookie SET expireTime = ? WHERE id = ?');
		const result = query.run(Date.now() + 1000 * 30 * 60, cookieID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Updated cookie successfully'
			};
		} else {
			console.error('Failed cookie updating - cookieID:', cookieID);

			return {
				success: false,
				message: 'Failed to update cookie'
			};
		}
	}
}

/**
 * Service for managing customer-related database operations
 * @extends BaseDatabaseService
 */
class CustomerService extends BaseDatabaseService {
	constructor() {
		super();
	}

	/**
	 * Convert database customer response to a CustomerRecord
	 * @private
	 * @param {DatabaseCustomerResponse} record - The raw database customer response
	 * @returns {CustomerRecord} Transformed customer record
	 */
	private CustomerDatabaseResponseToCustomerRecord(record: DatabaseCustomerResponse): CustomerRecord {
		const returnData: CustomerRecord = {
			id: record.id,
			userID: record.userID,
			firstName: record.firstName,
			lastName: record.lastName,
			email: record.email,
			phone: record.phone,
			address: {
				street: record.address_street,
				city: record.address_city,
				state: record.address_state,
				zip: record.address_zip
			},
			deleted: record.deleted
		};
		return returnData;
	}

	/**
	 * Add a new customer to the database
	 * @param {CustomerRecord} customer - The customer record to create
	 * @returns {DatabaseResponse} Response indicating success or failure of customer creation
	 */
	createCustomer(customer: CustomerRecord): DatabaseResponse {
		const query = this.db.prepare(
			'Insert into customers (userID, firstName, lastName, email, phone, address_street, address_city, address_state, address_zip, deleted) VALUES (@userID, @firstName, @lastName, @email, @phone, @address_street, @address_city, @address_state, @address_zip, @deleted)'
		);
		const result = query.run({
			userID: customer.userID,
			firstName: customer.firstName,
			lastName: customer.lastName,
			email: customer.email,
			phone: customer.phone,
			address_street: customer.address.street,
			address_city: customer.address.city,
			address_state: customer.address.state,
			address_zip: customer.address.zip,
			deleted: 0
		});

		if (result.changes == 1) {
			return {
				success: true,
				message: 'Created customer successfully'
			};
		} else {
			console.error('Failed to create customer - Customer', customer);
			return {
				success: false,
				message: 'Failed to create customer'
			};
		}
	}

	/**
	 * Retrieve customers for a specific user, excluding deleted customers
	 * @param {number} userID - The ID of the user to retrieve customers for
	 * @returns {DatabaseDataResponse<CustomerRecord[]>} List of customer records
	 */
	getCustomers(userID: number): DatabaseDataResponse<CustomerRecord[]> {
		const query = this.db.prepare('Select * from customers where userID = ? and deleted = 0');
		const response = <DatabaseCustomerResponse[] | null>query.all(userID);
		const resultArray: CustomerRecord[] = [];

		if (response != null) {
			for (const item of response) {
				const data = this.CustomerDatabaseResponseToCustomerRecord(item);
				resultArray.push(data);
			}
			return {
				success: true,
				message: 'Got customers successfully',
				data: resultArray
			};
		} else {
			console.error('Failed to get customer - UserID:', userID);
			return {
				success: false,
				message: 'Failed to get customers'
			};
		}
	}

	/**
	 * Retrieve a specific customer by their ID
	 * @param {number} id - The unique identifier of the customer
	 * @returns {DatabaseDataResponse<CustomerRecord>} The customer record if found
	 */
	getCustomer(id: number): DatabaseDataResponse<CustomerRecord> {
		const query = this.db.prepare('Select * from customers where id = ?');
		const result = <DatabaseCustomerResponse>query.get(id);
		if (result) {
			const data = this.CustomerDatabaseResponseToCustomerRecord(result);
			return {
				success: true,
				message: 'Successfully got customers',
				data: data
			};
		} else {
			console.error('Failed to get customer - id:', id);
			return {
				success: false,
				message: 'Failed to get customer'
			};
		}
	}

	/**
	 * Update a customer's information by their ID
	 * @param {number} customerID - The unique identifier of the customer to update
	 * @param {CustomerRecord} customer - The updated customer record
	 * @returns {DatabaseResponse} Response indicating success or failure of customer update
	 */
	updateCustomer(customerID: number, customer: CustomerRecord): DatabaseResponse {
		const query = this.db.prepare(
			'UPDATE customers SET firstName = @firstName, lastName = @lastName, email = @email, phone = @phone, address_street = @address_street, address_city= @address_city, address_state = @address_state, address_zip = @address_zip, deleted = @deleted WHERE id = @id'
		);
		const result = query.run({
			userID: customer.userID,
			firstName: customer.firstName,
			lastName: customer.lastName,
			email: customer.email,
			phone: customer.phone,
			address_street: customer.address.street,
			address_city: customer.address.city,
			address_state: customer.address.state,
			address_zip: customer.address.zip,
			deleted: customer.deleted,
			id: customerID
		});

		if (result.changes == 1) {
			return {
				success: true,
				message: 'Updated customer successfully'
			};
		} else {
			console.error('Failed to update customer - customerID:', customerID);
			return {
				success: false,
				message: 'Failed to update customer'
			};
		}
	}

	/**
	 * Soft delete a customer by marking them as deleted
	 * @param {number} customerID - The unique identifier of the customer to delete
	 * @returns {DatabaseResponse} Response indicating success or failure of customer deletion
	 */
	deleteCustomer(customerID: number): DatabaseResponse {
		const query = this.db.prepare('UPDATE customers SET deleted = 1 WHERE id = ?');
		const result = query.run(customerID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Customer was deleted successfully'
			};
		} else {
			console.error('Failed to delete customer - customerID:', customerID);
			return {
				success: false,
				message: 'Failed to delete customer'
			};
		}
	}
}
/**
 * Service for managing appointment-related database operations
 * @class
 * @extends BaseDatabaseService
 */
class AppointmentService extends BaseDatabaseService {
	constructor() {
		super();
	}

	/**
	 * Converts a database appointment response to an appointment record
	 * @private
	 * @param {DatabaseAppointmentResponse} record - The raw database appointment response
	 * @returns {AppointmentRecord} Transformed appointment record
	 */
	private AppointmentDatabaseResponseToAppointmentRecord(record: DatabaseAppointmentResponse): AppointmentRecord {
		const returnData: AppointmentRecord = {
			id: record.id,
			userID: record.userID,
			customerID: record.customerID,
			title: record.title,
			description: record.description,
			time: {
				date: record.time_date,
				start: record.time_start,
				end: record.time_end,
				exact: record.time_exact
			},
			address: {
				street: record.address_street,
				city: record.address_city,
				state: record.address_state,
				zip: record.address_zip
			},
			deleted: record.deleted
		};
		return returnData;
	}

	/**
	 * Creates a new appointment in the database
	 * @param {BaseAppointmentRecord} appointment - The appointment details to create
	 * @returns {DatabaseResponse} Result of the appointment creation
	 */
	createAppointment(appointment: BaseAppointmentRecord): DatabaseResponse {
		const query = this.db.prepare(
			'Insert into appointments (userID, customerID, title, description, address_street, address_city, address_state, address_zip, time_date, time_start, time_end, time_exact, deleted) VALUES (@userID, @customerID, @title, @description, @address_street, @address_city, @address_state, @address_zip, @time_date, @time_start, @time_end, @time_exact, @deleted)'
		);
		const result = query.run({
			userID: appointment.userID,
			customerID: appointment.customerID,
			title: appointment.title,
			description: appointment.description,
			address_street: appointment.address.street,
			address_city: appointment.address.city,
			address_state: appointment.address.state,
			address_zip: appointment.address.zip,
			time_date: appointment.time.date,
			time_start: appointment.time.start,
			time_end: appointment.time.end,
			time_exact: appointment.time.exact,
			deleted: 0
		});

		if (result.changes == 1) {
			return {
				success: true,
				message: 'Appointment created'
			};
		} else {
			console.error('Failed to create appointment - appointment:', appointment);
			return {
				success: false,
				message: 'Appointment creation failed'
			};
		}
	}

	/**
	 * Retrieves a specific appointment by its ID
	 * @param {number} appointmentID - The unique identifier of the appointment
	 * @returns {DatabaseDataResponse<AppointmentRecord>} The retrieved appointment or error response
	 */
	getAppointment(appointmentID: number): DatabaseDataResponse<AppointmentRecord> {
		const query = this.db.prepare('SELECT * from appointments WHERE id = ?');
		const result = <DatabaseAppointmentResponse>query.get(appointmentID);
		if (result) {
			return {
				success: true,
				message: 'Appointment was retrieved successfully',
				data: this.AppointmentDatabaseResponseToAppointmentRecord(result)
			};
		} else {
			console.error('Failed to retrieve appointment - appointmentID:', appointmentID);
			return {
				success: false,
				message: "Appointment couldn't be found"
			};
		}
	}

	/**
	 * Retrieves all appointments for a specific customer
	 * @param {number} customerID - The unique identifier of the customer
	 * @returns {DatabaseDataResponse<AppointmentRecord[]>} List of customer's appointments or error response
	 */
	getAppointmentsByCustomerID(customerID: number): DatabaseDataResponse<AppointmentRecord[]> {
		const query = this.db.prepare('SELECT * from appointments WHERE customerID = ?');
		const result = <DatabaseAppointmentResponse[]>query.all(customerID);
		const resultArray: AppointmentRecord[] = [];
		if (result) {
			for (const item of result) {
				const data = this.AppointmentDatabaseResponseToAppointmentRecord(item);
				resultArray.push(data);
			}
			return {
				success: true,
				message: 'Appointments found',
				data: resultArray
			};
		} else {
			console.error('Failed to retrieve appointments - customerID:', customerID);
			return {
				success: false,
				message: "Appointments couldn't be found"
			};
		}
	}

	/**
	 * Retrieves all non-deleted appointments for a specific user
	 * @param {number} userID - The unique identifier of the user
	 * @returns {DatabaseDataResponse<AppointmentRecord[]>} List of user's appointments or error response
	 */
	getAppointmentsByUserID(userID: number): DatabaseDataResponse<AppointmentRecord[]> {
		const query = this.db.prepare('SELECT * from appointments WHERE userID = ? and deleted = 0');
		const result = <DatabaseAppointmentResponse[]>query.all(userID);
		const resultArray: AppointmentRecord[] = [];
		if (result) {
			for (const item of result) {
				const data = this.AppointmentDatabaseResponseToAppointmentRecord(item);
				resultArray.push(data);
			}
			return {
				success: true,
				message: 'Appointments found',
				data: resultArray
			};
		} else {
			console.error('Failed to retrieve appointments - userID:', userID);
			return {
				success: false,
				message: "Appointments couldn't be found"
			};
		}
	}

	/**
	 * Updates an existing appointment's information
	 * @param {number} appointmentID - The unique identifier of the appointment to update
	 * @param {AppointmentRecord} appointment - The updated appointment details
	 * @returns {DatabaseResponse} Result of the update operation
	 */
	updateAppointmentByID(appointmentID: number, appointment: BaseAppointmentRecord): DatabaseResponse {
		const query = this.db.prepare(
			'Update appointments set userID = @userID, customerID=@customerID, title=@title, description=@description, address_street= @address_street, address_city=@address_city, address_state=@address_state, address_zip=@address_zip, time_date = @time_date, time_start = @time_start, time_end = @time_end, time_exact = @time_exact, deleted=@deleted where id = @id'
		);
		const result = query.run({
			userID: appointment.userID,
			customerID: appointment.customerID,
			title: appointment.title,
			description: appointment.description,
			address_street: appointment.address.street,
			address_city: appointment.address.city,
			address_state: appointment.address.state,
			address_zip: appointment.address.zip,
			time_date: appointment.time.date,
			time_start: appointment.time.start,
			time_end: appointment.time.end,
			time_exact: appointment.time.exact,
			deleted: 0,
			id: appointmentID
		});

		if (result.changes == 1) {
			return {
				success: true,
				message: 'Appointment was updated'
			};
		} else {
			console.error('Failed to update appointment - appointmentID:', appointmentID);
			return {
				success: false,
				message: "Appointment couldn't be updated"
			};
		}
	}

	/**
	 * Soft deletes an appointment by marking it as deleted
	 * @param {number} appointmentID - The unique identifier of the appointment to delete
	 * @returns {DatabaseResponse} Result of the delete operation
	 */
	deleteAppointment(appointmentID: number): DatabaseResponse {
		const query = this.db.prepare('UPDATE appointments SET deleted = 1 WHERE id = ?');
		const result = query.run(appointmentID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Appointment was deleted'
			};
		} else {
			console.error('Failed to delete appointment - appointmentID:', appointmentID);
			return {
				success: false,
				message: "Appointment couldn't be deleted"
			};
		}
	}
}

/**
 * Service for managing service-related database operations
 * @class
 * @extends BaseDatabaseService
 */
class ServiceService extends BaseDatabaseService {
	constructor() {
		super();
	}

	/**
	 * Creates a new service in the database
	 * @param {BaseServiceRecord} service - The service details to create
	 * @returns {DatabaseResponse} Result of the service creation
	 */
	createService(service: BaseServiceRecord): DatabaseResponse {
		const query = this.db.prepare('Insert into services (userID, name, description, price, deleted) VALUES (@userID, @name, @description, @price,  @deleted)');
		const result = query.run({
			userID: service.userID,
			name: service.name,
			description: service.description,
			price: service.price,
			deleted: 0
		});

		if (result.changes == 1) {
			return {
				success: true,
				message: 'Service created'
			};
		} else {
			console.error('Failed to create service - service:', service);
			return {
				success: false,
				message: "Service couldn't be created"
			};
		}
	}

	/**
	 * Retrieves a specific service by its ID
	 * @param {number} serviceID - The unique identifier of the service
	 * @returns {DatabaseDataResponse<ServiceRecord>} The retrieved service or error response
	 */
	getService(serviceID: number): DatabaseDataResponse<ServiceRecord> {
		const query = this.db.prepare('SELECT * from services WHERE id = ?');
		const result = <ServiceRecord>query.get(serviceID);
		if (result) {
			return {
				success: true,
				message: 'Service found successfully',
				data: result
			};
		} else {
			console.error('Failed to get service - serviceID:', serviceID);
			return {
				success: false,
				message: "Service wasn't found"
			};
		}
	}

	/**
	 * Retrieves all non-deleted services for a specific user
	 * @param {number} userID - The unique identifier of the user
	 * @returns {DatabaseDataResponse<ServiceRecord[]>} List of user's services or error response
	 */
	getServicesByUserID(userID: number): DatabaseDataResponse<ServiceRecord[]> {
		const query = this.db.prepare('SELECT * from services WHERE userID = ? and deleted = 0');
		const result = <ServiceRecord[]>query.all(userID);
		if (result) {
			return {
				success: true,
				message: 'Service found',
				data: result
			};
		} else {
			console.error('Failed to get service - userID:', userID);
			return {
				success: false,
				message: "Service wasn't found"
			};
		}
	}

	/**
	 * Updates an existing service's information
	 * @param {number} serviceID - The unique identifier of the service to update
	 * @param {ServiceRecord} service - The updated service details
	 * @returns {DatabaseResponse} Result of the update operation
	 */
	updateServiceByID(serviceID: number, service: BaseServiceRecord): DatabaseResponse {
		const query = this.db.prepare('Update services set name = @name, description=@description, price=@price, deleted = @deleted WHERE id = @id');
		const result = query.run({
			id: serviceID,
			name: service.name,
			description: service.description,
			price: service.price,
			deleted: 0
		});

		if (result.changes == 1) {
			return {
				success: true,
				message: 'Service was updated'
			};
		} else {
			console.error('Failed to update service - serviceID:', serviceID);
			return {
				success: false,
				message: "Service wasn't updated"
			};
		}
	}

	/**
	 * Soft deletes a service by marking it as deleted
	 * @param {number} serviceID - The unique identifier of the service to delete
	 * @returns {DatabaseResponse} Result of the delete operation
	 */
	deleteService(serviceID: number): DatabaseResponse {
		const query = this.db.prepare('UPDATE services SET deleted = 1 WHERE id = ?');
		const result = query.run(serviceID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Service was deleted'
			};
		} else {
			console.error('Failed to delete service - serviceID:', serviceID);
			return {
				success: false,
				message: "Service wasn't updated"
			};
		}
	}
}

/**
 * Service for managing note-related database operations
 * @class
 * @extends BaseDatabaseService
 */
class NoteService extends BaseDatabaseService {
	constructor() {
		super();
	}

	/**
	 * Creates a new note in the database
	 * @private
	 * @param {BaseNote} noteData - The note details to create
	 * @returns {DatabaseDataResponse<number>} Result of note creation with inserted note ID
	 */
	private CreateNote(noteData: BaseNote): DatabaseDataResponse<number> {
		const query = this.db.prepare('INSERT into notes (title, note, createdDate, deleted) VALUES (@title, @note, @createdDate, @deleted)');
		const result = query.run({
			title: noteData.title,
			note: noteData.note,
			createdDate: noteData.createdDate,
			deleted: 0
		});
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Note was created',
				data: <number>result.lastInsertRowid
			};
		} else {
			console.error('Failed to create note - noteData:', noteData);
			return {
				success: false,
				message: 'Note failed to create'
			};
		}
	}

	/**
	 * Retrieves a specific note by its ID
	 * @param {number} noteID - The unique identifier of the note
	 * @returns {DatabaseDataResponse<Note>} The retrieved note or error response
	 */
	GetNoteByID(noteID: number): DatabaseDataResponse<Note> {
		const query = this.db.prepare('Select * FROM notes WHERE id = ?');
		const result = <Note>query.get(noteID);
		if (result) {
			return {
				success: true,
				message: 'Note found',
				data: result
			};
		} else {
			console.error('Failed to get Note - noteID:', noteID);
			return {
				success: false,
				message: "Note wasn't found"
			};
		}
	}

	/**
	 * Updates an existing note's information
	 * @param {Note} note - The updated note details
	 * @returns {DatabaseResponse} Result of the update operation
	 */
	UpdateNotesByID(note: Note): DatabaseResponse {
		const query = this.db.prepare('Update notes SET title = @title, note = @note WHERE id = @id');
		const result = query.run({
			title: note.title,
			note: note.note,
			id: note.id
		});
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Note updated'
			};
		} else {
			console.error('Failed to update Note - note:', note);
			return {
				success: false,
				message: "Note couldn't be updated"
			};
		}
	}

	/**
	 * Soft deletes a note by marking it as deleted
	 * @param {number} noteID - The unique identifier of the note to delete
	 * @returns {DatabaseResponse} Result of the delete operation
	 */
	DeleteNoteByID(noteID: number): DatabaseResponse {
		const query = this.db.prepare('Update notes SET deleted = 1 WHERE id = ?');
		const result = query.run(noteID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Note deleted'
			};
		} else {
			console.error('Failed to delete note - noteID:', noteID);
			return {
				success: false,
				message: "Note couldn't be deleted"
			};
		}
	}

	/**
	 * Creates a new note associated with a specific customer
	 * @param {number} customerID - The unique identifier of the customer
	 * @param {BaseNote} noteData - The note details to create
	 * @returns {DatabaseResponse} Result of customer note creation
	 */
	CreateCustomerNote(customerID: number, noteData: BaseNote): DatabaseResponse {
		const newNote = this.CreateNote(noteData);
		if (newNote.success) {
			const query = this.db.prepare('INSERT into customer_notes (customerID, noteID) VALUES (@customerID, @noteID)');
			const result = query.run({
				customerID: customerID,
				noteID: newNote.data
			});
			if (result.changes == 1) {
				return {
					success: true,
					message: 'Note created'
				};
			}
		}

		console.error('Failed to create note - note:', noteData);
		return {
			success: false,
			message: "Notes couldn't be found"
		};
	}

	/**
	 * Retrieves all non-deleted notes for a specific customer
	 * @param {number} customerID - The unique identifier of the customer
	 * @returns {DatabaseDataResponse<Note[]>} List of customer's notes or error response
	 */
	GetCustomerNotes(customerID: number): DatabaseDataResponse<Note[]> {
		const query = this.db.prepare('Select n.* FROM customer_notes cn INNER JOIN notes n ON cn.noteID = n.id WHERE cn.customerID = ? and deleted = 0');
		const result = <Note[]>query.all(customerID);
		if (result) {
			return {
				success: true,
				message: 'Note found',
				data: result
			};
		} else {
			console.error('Failed to get note - customerID:', customerID);
			return {
				success: false,
				message: "Notes couldn't be found"
			};
		}
	}

	/**
	 * Creates a new note associated with a specific appointment
	 * @param {number} appointmentID - The unique identifier of the appointment
	 * @param {BaseNote} noteData - The note details to create
	 * @returns {DatabaseResponse} Result of appointment note creation
	 */
	CreateAppointmentNote(appointmentID: number, noteData: BaseNote): DatabaseResponse {
		const newNote = this.CreateNote(noteData);

		if (newNote.success) {
			const query = this.db.prepare('INSERT into appointment_notes (appointmentID, noteID) VALUES (@appointmentID, @noteID)');

			const result = query.run({
				appointmentID: appointmentID,
				noteID: newNote.data
			});

			if (result.changes == 1) {
				return {
					success: true,
					message: 'Note created'
				};
			}
		}

		console.error('Failed to create note - note:', noteData);
		return {
			success: false,
			message: "Note couldn't be created"
		};
	}

	/**
	 * Retrieves all non-deleted notes for a specific appointment
	 * @param {number} appointmentID - The unique identifier of the appointment
	 * @returns {DatabaseDataResponse<Note[]>} List of appointment's notes or error response
	 */
	GetAppointmentNotes(appointmentID: number): DatabaseDataResponse<Note[]> {
		const query = this.db.prepare('SELECT n.* FROM appointment_notes an INNER JOIN notes n ON an.noteID = n.id WHERE an.appointmentID = ? and deleted = 0');
		const result = <Note[]>query.all(appointmentID);
		if (result) {
			return {
				success: true,
				message: 'Note Found',
				data: result
			};
		} else {
			console.error('Failed to get note - appointmentID:', appointmentID);
			return {
				success: false,
				message: "Note couldn't be created"
			};
		}
	}

	/**
	 * Creates a new note associated with a specific service
	 * @param {number} serviceID - The unique identifier of the service
	 * @param {BaseNote} noteData - The note details to create
	 * @returns {DatabaseResponse} Result of service note creation
	 */
	CreateServiceNote(serviceID: number, noteData: BaseNote): DatabaseResponse {
		const newNote = this.CreateNote(noteData);
		if (newNote.success) {
			const query = this.db.prepare('INSERT into service_notes (serviceID, noteID) VALUES (@serviceID, @noteID)');
			const result = query.run({
				serviceID: serviceID,
				noteID: newNote.data
			});

			if (result.changes == 1) {
				return {
					success: true,
					message: 'Note created'
				};
			}
		}

		console.error('Failed to create note - note:', noteData);
		return {
			success: false,
			message: "Note couldn't be created"
		};
	}

	/**
	 * Retrieves all non-deleted notes for a specific service
	 * @param {number} serviceID - The unique identifier of the service
	 * @returns {DatabaseDataResponse<Note[]>} List of service's notes or error response
	 */
	GetServiceNotes(serviceID: number): DatabaseDataResponse<Note[]> {
		const query = this.db.prepare('SELECT n.* FROM service_notes sn INNER JOIN notes n ON sn.noteID = n.id WHERE sn.serviceID = ? and deleted = 0');
		const result = <Note[]>query.all(serviceID);
		if (result) {
			return {
				success: true,
				message: 'Note Found',
				data: result
			};
		} else {
			console.error('Failed to get note - serviceID:', serviceID);
			return {
				success: false,
				message: "Note couldn't be found"
			};
		}
	}
}

export const AuthDatabaseService = new AuthService();
export const CustomerDatabaseService = new CustomerService();
export const AppointmentDatabaseService = new AppointmentService();
export const ServiceDatabaseService = new ServiceService();
export const NoteDatabaseService = new NoteService();

export { AuthService, CustomerService, AppointmentService, ServiceService, NoteService };
