import type { cookie, CustomerRecord, BaseUserRecord, BaseCustomerRecord as DatabaseCustomerResponse, BaseAppointmentRecord, AppointmentRecord, UserRecord } from '$lib/types';
import { ObjectId, type Document, type UpdateResult } from 'mongodb';
import Database from 'better-sqlite3';

type Address = {
	street: string;
	city: string;
	state: string;
	zip: number;
};

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

function getDB() {
	return Database('mydb.sqlite', { verbose: console.log });
}

export class DatabaseAuthService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new user to the database
	addNewUser(user: BaseUserRecord): boolean {
		const query = this.db.prepare('Insert into users (firstName, lastName, email, hashedPassword, deleted) VALUES (@firstName, @lastName, @email, @hashedPassword, @deleted)');
		let result = query.run({ firstName: user.firstName, lastName: user.lastName, email: user.email, hashedPassword: user.password, deleted: 0 });
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Retrieve a user by their email address
	getUserByEmail(email: string): UserRecord | null {
		const query = this.db.prepare('Select * from users WHERE email = ?');
		const result = query.get(email);
		if (result) {
			return <UserRecord>result;
		} else {
			return null;
		}
	}

	// Add a new cookie to the database with an expiration time
	addCookie(cookie: string, userID: number): boolean {
		const query = this.db.prepare('Insert into cookie (id, userID, expireTime) values (@id, @userID, @expireTime)');
		const result = query.run({
			id: cookie,
			userID: userID,
			expireTime: Date.now() + 3600 * 1000 // Cookie expires in 1 hour
		});
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Remove a specific cookie from the database
	removeCookie(cookie: string): boolean {
		const query = this.db.prepare('DELETE FROM users WHERE id = ?');
		const result = query.run(cookie);
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Retrieve a cookie by its value
	getCookie(cookie: string): cookie | null {
		const query = this.db.prepare('Select * from cookie WHERE id = ?');
		const result = query.get(cookie);
		if (result) {
			return <cookie>result;
		} else {
			return null;
		}
	}

	// Update the expiration time of a specific cookie
	updateCookie(cookie: string): boolean {
		let query = this.db.prepare('Update cookie SET expireTime = ? WHERE id = ?');
		let result = query.run(Date.now(), cookie);
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}
}

const defaultAuthDatabase = new DatabaseAuthService();

// Exported functions for authentication database operations
export const Auth_AddNewUser = (user: BaseUserRecord) => defaultAuthDatabase.addNewUser(user);
export const Auth_GetUserByEmail = (email: string) => defaultAuthDatabase.getUserByEmail(email);
export const Auth_AddCookie = (cookie: string, userID: number) => defaultAuthDatabase.addCookie(cookie, userID);
export const Auth_RemoveCookie = (cookie: string) => defaultAuthDatabase.removeCookie(cookie);
export const Auth_GetCookie = (cookie: string) => defaultAuthDatabase.getCookie(cookie);
export const Auth_UpdateCookie = (cookie: string) => defaultAuthDatabase.updateCookie(cookie);

// Create a class to handle database operations for customer-related functions
export class DatabaseCustomerService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	private CustomerDatabaseResponseToCustomerRecord(record: DatabaseCustomerResponse): CustomerRecord {
		let returnData: CustomerRecord = {
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
	addNewCustomer(customer: CustomerRecord): boolean {
		const query = this.db.prepare(
			'Insert into customers (userID, firstName, lastName, email, phone, address_street, address_city, address_state, address_zip, deleted) VALUES (@userID, @firstName, @lastName, @email, @phone, @address_street, @address_city, @address_state, @address_zip, @deleted)'
		);
		let result = query.run({
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
			return true;
		} else {
			return false;
		}
	}

	// Retrieve customers for a specific user, excluding deleted customers
	getCustomers(userID: number): CustomerRecord[] | null {
		const query = this.db.prepare('Select * from customers where userID = ? and deleted = 0');
		const result = <DatabaseCustomerResponse[]>query.all(userID);
		let resultArray: CustomerRecord[] = [];
		if (result) {
			for (let item of result) {
				let data = this.CustomerDatabaseResponseToCustomerRecord(item);
				resultArray.push(data);
			}
			return resultArray;
		} else {
			return null;
		}
	}

	// Retrieve a specific customer by their ID
	getCustomerByID(id: number): CustomerRecord | null {
		const query = this.db.prepare('Select * from customers where id = ?');
		const result = <DatabaseCustomerResponse>query.get(id);
		if (result) {
			let data = this.CustomerDatabaseResponseToCustomerRecord(result);
			return data;
		} else {
			return null;
		}
	}

	// Update a customer's information by their ID
	updateCustomerByID(id: number, customer: CustomerRecord): boolean {
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
			id: id
		});

		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	deleteCustomerByID(id: number): boolean {
		const query = this.db.prepare(
			'UPDATE customers SET deleted = 1 WHERE id = ?'
		);
		const result = query.run(id);
		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}
}

const defaultCustomerDatabase = new DatabaseCustomerService();

// Exported functions for customer database operations
export const Customer_AddNewCustomer = (customer: CustomerRecord) => defaultCustomerDatabase.addNewCustomer(customer);
export const Customer_GetCustomers = (userID: number) => defaultCustomerDatabase.getCustomers(userID);
export const Customer_GetCustomerByID = (id: number) => defaultCustomerDatabase.getCustomerByID(id);
export const Customer_UpdateCustomerByID = (id: number, customer: CustomerRecord) => defaultCustomerDatabase.updateCustomerByID(id, customer);
export const Customer_DeleteCustomerByID = (id: number) => defaultCustomerDatabase.deleteCustomerByID(id);

// Create a class to handle database operations for appointment-related functions
export class DatabaseAppointmentService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new appointment to the database
	addNewAppointment(appointment: BaseAppointmentRecord): boolean {
		try{
		const query = this.db.prepare(
			'Insert into appointments (userID, customerID, title, description, address_street, address_city, address_state, address_zip, time_date, time_start, time_end, time_exact, deleted) VALUES (@userID, @customerID, @title, @description, @address_street, @address_city, @address_state, @address_zip, @time_date, @time_start, @time_end, @time_exact, @deleted)'
		);
		let result = query.run({
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
		});}catch(e){console.log(e)}

		if (result.changes == 1) {
			return true;
		} else {
			return false;
		}
	}

	// Retrieve a specific appointment by its ID
	async getAppointmentByID(id: string): Promise<AppointmentRecord | null> {
		const result = await this.db.collection('appointments').findOne({ _id: new ObjectId(id) });
		return <AppointmentRecord | null>result;
	}

	// Retrieve appointments for a specific customer, excluding deleted appointments
	async getAppointmentsByCustomerID(customerID: string): Promise<AppointmentRecord[] | null> {
		const result = this.db.collection('appointments').find({ customerID: customerID, deleted: false });
		const documents = await result.toArray();

		// Return null if no documents found, otherwise return the appointment records
		//@ts-ignore
		if (documents == null) {
			return null;
		} else {
			return <AppointmentRecord[]>documents;
		}
	}

	// Retrieve appointments for a specific user, sorted by time and excluding deleted appointments
	async getAppointmentsByUserID(userID: string): Promise<AppointmentRecord[] | null> {
		const result = this.db.collection('appointments').find({ userID: userID, deleted: false }).sort({ 'time.exact': 1 });
		const documents = await result.toArray();

		// Return null if no documents found, otherwise return the appointment records
		if (documents == null) {
			return null;
		} else {
			return <AppointmentRecord[]>documents;
		}
	}

	// Update an appointment's information by its ID
	async updateAppointmentByID(id: string, appointment: object): Promise<boolean> {
		// Use $set to update only the provided fields, preserving other existing fields
		const result = await this.db.collection('appointments').updateOne({ _id: new ObjectId(id) }, { $set: appointment });

		// Return true if at least one document was modified, false otherwise
		return result.acknowledged;
	}
}

const defaultAppointmentDatabase = new DatabaseAppointmentService();

// Exported functions for appointment database operations
export const Appointment_AddNewAppointment = (appointment: BaseAppointmentRecord) => defaultAppointmentDatabase.addNewAppointment(appointment);
export const Appointment_GetAppointmentByID = (id: string) => defaultAppointmentDatabase.getAppointmentByID(id);
export const Appointment_GetAppointmentsByCustomerID = (id: string) => defaultAppointmentDatabase.getAppointmentsByCustomerID(id);
export const Appointment_GetAppointmentsByUserID = (id: string) => defaultAppointmentDatabase.getAppointmentsByUserID(id);
export const Appointment_UpdateAppointmentByID = (id: string, appointment: object) => defaultAppointmentDatabase.updateAppointmentByID(id, appointment);
