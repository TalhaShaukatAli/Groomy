import type { cookie, CustomerRecord, BaseUserRecord, BaseAppointmentRecord, AppointmentRecord, UserRecord, Note, BaseNote, ServiceRecord, BaseServiceRecord, DatabaseResponse, DatabaseDataResponse } from '$lib/types';
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

function getDB() {
	const db = new Database('mydb.sqlite', { verbose: console.log });
	db.prepare('PRAGMA journal_mode = WAL').run();
	return db;
}

class BaseDatabaseService {
	protected db: Database.Database;
	private static dbInstance: Database.Database | null = null;

	constructor() {
		//Check if ddbInstance is null
		if (!BaseDatabaseService.dbInstance) {
			//Create Database and assign it too dbInstance
			try {
				BaseDatabaseService.dbInstance = new Database('mydb.sqlite', { verbose: console.log });
				BaseDatabaseService.dbInstance.prepare('PRAGMA journal_mode = WAL').run();
			} catch (error) {
				console.error('Database initialization failed:', error);
				throw error;
			}
		}
		//Set database equal to the single db instance
		this.db = BaseDatabaseService.dbInstance;
	}
}

class AuthService extends BaseDatabaseService {
	constructor() {
		super();
	}
	// Add a new user to the database
	createUser(user: BaseUserRecord): DatabaseResponse {
		const existingUser = this.getUserByEmail(user.email);
		if(existingUser.success){
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

	// Retrieve a user by their email address
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

	createCookie(cookieID: string, userID: number): DatabaseResponse {
		const query = this.db.prepare('Insert into cookie (id, userID, expireTime) values (@id, @userID, @expireTime)');
		const result = query.run({
			id: cookieID,
			userID: userID,
			expireTime: Date.now() + 3600 * 1000 // Cookie expires in 1 hour
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

	// Remove a specific cookie from the database
	removeCookie(userID: string): DatabaseResponse {
		const query = this.db.prepare('DELETE FROM cookie WHERE id = ?');
		const result = query.run(userID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Successful cookie deletion'
			};
		} else {
			console.error('Failed to remove cookie - userID:', userID);
			return {
				success: false,
				message: 'Failed cookie deletion'
			};
		}
	}

	// Retrieve a cookie by the userID
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

	// Update the expiration time of a specific cookie
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

class CustomerService extends BaseDatabaseService {
	constructor() {
		super();
	}

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

	// Add a new customer to the database
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

	// Retrieve customers for a specific user, excluding deleted customers
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
	// Retrieve a specific customer by their ID
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

	// Update a customer's information by their ID
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

	deleteCustomer(customerID: number): DatabaseResponse {
		const query = this.db.prepare('UPDATE customers SET deleted = 1 WHERE id = ?');
		const result = query.run(customerID);
		if (result.changes == 1) {
			return {
				success: true,
				message: 'Customer was deleted successfully'
			};
		} else {
			return {
				success: false,
				message: 'Failed to delete customer'
			};
		}
	}
}

export const AuthDatabaseService = new AuthService();
export const CustomerDatabaseService = new CustomerService();

// Create a class to handle database operations for appointment-related functions
export class DatabaseAppointmentService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

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

	// Add a new appointment to the database
	addNewAppointment(appointment: BaseAppointmentRecord): boolean {
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
			return true;
		} else {
			return false;
		}
	}

	// Retrieve a specific appointment by its ID
	getAppointmentByID(id: number): AppointmentRecord | null {
		const query = this.db.prepare('SELECT * from appointments WHERE id = ?');
		const result = <DatabaseAppointmentResponse>query.get(id);
		if (result) {
			return this.AppointmentDatabaseResponseToAppointmentRecord(result);
		} else {
			return null;
		}
	}

	// Retrieve appointments for a specific customer, excluding deleted appointments
	getAppointmentsByCustomerID(customerID: number): AppointmentRecord[] | null {
		const query = this.db.prepare('SELECT * from appointments WHERE customerID = ?');
		const result = <DatabaseAppointmentResponse[]>query.all(customerID);
		const resultArray: AppointmentRecord[] = [];
		if (result) {
			for (const item of result) {
				const data = this.AppointmentDatabaseResponseToAppointmentRecord(item);
				resultArray.push(data);
			}
			return resultArray;
		} else {
			return null;
		}
	}

	// Retrieve appointments for a specific user, sorted by time and excluding deleted appointments
	getAppointmentsByUserID(userID: number): AppointmentRecord[] | null {
		const query = this.db.prepare('SELECT * from appointments WHERE userID = ? and deleted = 0');
		const result = <DatabaseAppointmentResponse[]>query.all(userID);
		const resultArray: AppointmentRecord[] = [];
		if (result) {
			for (const item of result) {
				const data = this.AppointmentDatabaseResponseToAppointmentRecord(item);
				resultArray.push(data);
			}
			return resultArray;
		} else {
			return null;
		}
	}

	// Update an appointment's information by its ID
	async updateAppointmentByID(id: number, appointment: AppointmentRecord): Promise<boolean> {
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
			id: id
		});

		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Delete an appointment's information by its ID
	deleteAppointmentByID(id: number): boolean {
		const query = this.db.prepare('UPDATE appointments SET deleted = 1 WHERE id = ?');
		const result = query.run(id);
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}
}

const defaultAppointmentDatabase = new DatabaseAppointmentService();

// Exported functions for appointment database operations
export const Appointment_AddNewAppointment = (appointment: BaseAppointmentRecord) => defaultAppointmentDatabase.addNewAppointment(appointment);
export const Appointment_GetAppointmentByID = (id: number) => defaultAppointmentDatabase.getAppointmentByID(id);
export const Appointment_GetAppointmentsByCustomerID = (id: number) => defaultAppointmentDatabase.getAppointmentsByCustomerID(id);
export const Appointment_GetAppointmentsByUserID = (id: number) => defaultAppointmentDatabase.getAppointmentsByUserID(id);
export const Appointment_UpdateAppointmentByID = (id: number, appointment: AppointmentRecord) => defaultAppointmentDatabase.updateAppointmentByID(id, appointment);
export const Appointment_DeleteAppointmentByID = (id: number) => defaultAppointmentDatabase.deleteAppointmentByID(id);

export class DatabaseNoteService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	//generics
	private CreateNote(noteData: BaseNote): number {
		const query = this.db.prepare('INSERT into notes (title, note, createdDate, deleted) VALUES (@title, @note, @createdDate, @deleted)');
		const result = query.run({
			title: noteData.title,
			note: noteData.note,
			createdDate: noteData.createdDate,
			deleted: 0
		});
		return <number>result.lastInsertRowid;
	}

	GetNoteByID(noteID: number): Note | null {
		const query = this.db.prepare('Select * FROM notes WHERE id = ?');
		const result = query.get(noteID);
		if (result == undefined) {
			return null;
		} else {
			return <Note>result;
		}
	}

	UpdateNotesByID(note: Note): boolean {
		const query = this.db.prepare('Update notes SET title = @title, note = @note WHERE id = @id');
		const result = query.run({
			title: note.title,
			note: note.note,
			id: note.id
		});
		if (result.changes) {
			return true;
		} else {
			return false;
		}
	}

	DeleteNoteByID(noteID: number): boolean {
		const query = this.db.prepare('Update notes SET deleted = 1 WHERE id = ?');
		const result = query.run(noteID);
		if (result.changes) {
			return true;
		} else {
			return false;
		}
	}

	//Customer Note
	CreateCustomerNote(customerID: number, noteData: BaseNote) {
		const noteID = this.CreateNote(noteData);
		const query = this.db.prepare('INSERT into customer_notes (customerID, noteID) VALUES (@customerID, @noteID)');
		const result = query.run({
			customerID: customerID,
			noteID: noteID
		});
		if (result.changes) {
			return true;
		} else {
			return false;
		}
	}

	GetCustomerNotes(customerID: number): Note[] {
		const query = this.db.prepare('Select n.* FROM customer_notes cn INNER JOIN notes n ON cn.noteID = n.id WHERE cn.customerID = ? and deleted = 0');
		const result = query.all(customerID);
		if (result == undefined) {
			return [];
		} else {
			return <Note[]>result;
		}
	}

	//Appointment Note
	CreateAppointmentNote(appointmentID: number, noteData: BaseNote) {
		const noteID = this.CreateNote(noteData);
		const query = this.db.prepare('INSERT into appointment_notes (appointmentID, noteID) VALUES (@appointmentID, @noteID)');
		const result = query.run({
			appointmentID: appointmentID,
			noteID: noteID
		});

		if (result.changes) {
			return true;
		} else {
			return false;
		}
	}

	GetAppointmentNotes(appointmentID: number): Note[] {
		const query = this.db.prepare('SELECT n.* FROM appointment_notes an INNER JOIN notes n ON an.noteID = n.id WHERE an.appointmentID = ? and deleted = 0');
		const result = query.all(appointmentID);
		if (result == undefined) {
			return [];
		} else {
			return <Note[]>result;
		}
	}

	//Services Notes
	CreateServiceNote(serviceID: number, noteData: BaseNote) {
		const noteID = this.CreateNote(noteData);
		const query = this.db.prepare('INSERT into service_notes (serviceID, noteID) VALUES (@serviceID, @noteID)');
		const result = query.run({
			serviceID: serviceID,
			noteID: noteID
		});

		if (result.changes) {
			return true;
		} else {
			return false;
		}
	}

	GetServiceNotes(serviceID: number) {
		const query = this.db.prepare('SELECT n.* FROM service_notes sn INNER JOIN notes n ON sn.noteID = n.id WHERE sn.serviceID = ? and deleted = 0');
		const result = query.all(serviceID);
		if (result == undefined) {
			return [];
		} else {
			return <Note[]>result;
		}
	}
}

const defaultNoteDatabase = new DatabaseNoteService();

//Generic
export const Notes_GetNoteByID = (noteID: number) => defaultNoteDatabase.GetNoteByID(noteID);
export const Notes_UpdateNotesByID = (note: Note) => defaultNoteDatabase.UpdateNotesByID(note);
export const Notes_DeleteNoteByID = (noteID: number) => defaultNoteDatabase.DeleteNoteByID(noteID);

//Appointment
export const Notes_CreateAppointmentNote = (appointmentID: number, noteData: BaseNote) => defaultNoteDatabase.CreateAppointmentNote(appointmentID, noteData);
export const Notes_GetAppointmentNotes = (appointmentID: number) => defaultNoteDatabase.GetAppointmentNotes(appointmentID);

//Customer
export const Notes_CreateCustomerNote = (customerID: number, noteData: BaseNote) => defaultNoteDatabase.CreateCustomerNote(customerID, noteData);
export const Notes_GetCustomerNotes = (customerID: number) => defaultNoteDatabase.GetCustomerNotes(customerID);

//Services
export const Notes_CreateServiceNote = (serviceID: number, noteData: BaseNote) => defaultNoteDatabase.CreateServiceNote(serviceID, noteData);
export const Notes_GetServiceNotes = (serviceID: number) => defaultNoteDatabase.GetServiceNotes(serviceID);

export class DatabaseServiceService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new appointment to the database
	addNewService(service: BaseServiceRecord): boolean {
		const query = this.db.prepare('Insert into services (userID, name, description, price, deleted) VALUES (@userID, @name, @description, @price,  @deleted)');
		const result = query.run({
			userID: service.userID,
			name: service.name,
			description: service.description,
			price: service.price,
			deleted: 0
		});

		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Retrieve a specific appointment by its ID
	getServiceByID(id: number): ServiceRecord | null {
		const query = this.db.prepare('SELECT * from services WHERE id = ?');
		const result = <ServiceRecord>query.get(id);
		if (result) {
			return result;
		} else {
			return null;
		}
	}

	// Retrieve appointments for a specific user, sorted by time and excluding deleted appointments
	getServicesByUserID(userID: number): ServiceRecord[] | null {
		const query = this.db.prepare('SELECT * from services WHERE userID = ? and deleted = 0');
		const result = <ServiceRecord[]>query.all(userID);
		if (result) {
			return result;
		} else {
			return null;
		}
	}

	// Update an appointment's information by its ID
	updateServiceByID(serviceID: number, service: ServiceRecord): boolean {
		const query = this.db.prepare('Update services set name = @name, description=@description, price=@price, deleted = @deleted WHERE id = @id');
		const result = query.run({
			id: serviceID,
			name: service.name,
			description: service.description,
			price: service.price,
			deleted: 0
		});

		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Delete an appointment's information by its ID
	deleteServiceByID(id: number): boolean {
		const query = this.db.prepare('UPDATE services SET deleted = 1 WHERE id = ?');
		const result = query.run(id);
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}
}
const defaultServiceDatabase = new DatabaseServiceService();

export const Service_AddNewService = (serviceData: BaseServiceRecord) => defaultServiceDatabase.addNewService(serviceData);
export const Service_GetServicesByID = (serviceID: number) => defaultServiceDatabase.getServiceByID(serviceID);
export const Service_GetServicesByUserID = (userID: number) => defaultServiceDatabase.getServicesByUserID(userID);
export const Service_UpdateByID = (serviceID: number, record: ServiceRecord) => defaultServiceDatabase.updateServiceByID(serviceID, record);
export const Service_DeleteByID = (serviceID: number) => defaultServiceDatabase.deleteServiceByID(serviceID);
