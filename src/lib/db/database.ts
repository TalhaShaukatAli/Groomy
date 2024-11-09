import type { cookie, CustomerRecord, BaseUserRecord, BaseCustomerRecord, BaseAppointmentRecord, AppointmentRecord } from '$lib/types';
import { ObjectId, type Document, type UpdateResult } from 'mongodb';
import { getDB } from './mongo';

// Create a class to handle database operations for authentication-related functions
export class DatabaseAuthService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new user to the database
	async addNewUser(user: BaseUserRecord): Promise<boolean> {
		const result = await this.db.collection('users').insertOne(user);
		return result.acknowledged;
	}

	// Retrieve a user by their email address
	async getUserByEmail(email: string): Promise<BaseUserRecord | null> {
		const result = await this.db.collection('users').findOne({ email: email });
		return <BaseUserRecord | null>result;
	}

	// Add a new cookie to the database with an expiration time
	async addCookie(cookie: string): Promise<boolean> {
		const result = await this.db.collection('cookie').insertOne({
			cookie: cookie,
			expireTime: Date.now() + 3600 * 1000 // Cookie expires in 1 hour
		});
		return result.acknowledged;
	}

	// Remove a specific cookie from the database
	async removeCookie(cookie: string): Promise<boolean> {
		const result = await this.db.collection('cookie').deleteOne({ cookie: cookie });
		return result.acknowledged;
	}

	// Retrieve a cookie by its value
	async getCookie(cookie: string): Promise<cookie | null> {
		const result = <cookie | null>await this.db.collection('cookie').findOne({ cookie: cookie });
		return result;
	}

	// Update the expiration time of a specific cookie
	async updateCookie(cookie: string): Promise<boolean> {
		const updateDoc = { $set: { expireTime: Date.now() + 3600 * 1000 } };
		let result = await this.db.collection('cookie').updateOne({ cookie: cookie }, updateDoc);
		return result.acknowledged;
	}
}

const defaultAuthDatabase = new DatabaseAuthService();

// Exported functions for authentication database operations
export const Auth_AddNewUser = (user: BaseUserRecord) => defaultAuthDatabase.addNewUser(user);
export const Auth_GetUserByEmail = (email: string) => defaultAuthDatabase.getUserByEmail(email);
export const Auth_AddCookie = (cookie: string) => defaultAuthDatabase.addCookie(cookie);
export const Auth_RemoveCookie = (cookie: string) => defaultAuthDatabase.removeCookie(cookie);
export const Auth_GetCookie = (cookie: string) => defaultAuthDatabase.getCookie(cookie);
export const Auth_UpdateCookie = (cookie: string) => defaultAuthDatabase.updateCookie(cookie);

// Create a class to handle database operations for customer-related functions
export class DatabaseCustomerService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new customer to the database
	async addNewCustomer(customer: BaseCustomerRecord): Promise<boolean> {
		const result = await this.db.collection('customer').insertOne(customer);
		return result.acknowledged;
	}

	// Retrieve customers for a specific user, excluding deleted customers
	async getCustomers(userID: string): Promise<CustomerRecord[] | null> {
		const result = this.db.collection('customer').find({ userID: userID, deleted: false });
		const documents = await result.toArray();

		// Return null if no documents found, otherwise return the customer records
		if (documents == null) {
			return null;
		} else {
			return <CustomerRecord[]>documents;
		}
	}

	// Retrieve a specific customer by their ID
	async getCustomerByID(id: string): Promise<CustomerRecord | null> {
		const result = await this.db.collection('customer').findOne({ _id: new ObjectId(id) });
		return <CustomerRecord | null>result;
	}

	// Update a customer's information by their ID
	async updateCustomerByID(id: string, customer: BaseCustomerRecord): Promise<boolean> {
		const result = await this.db.collection('customer').updateOne({ _id: new ObjectId(id) }, customer);
		return result.acknowledged;
	}
}

const defaultCustomerDatabase = new DatabaseCustomerService();

// Exported functions for customer database operations
export const Customer_AddNewCustomer = (customer: BaseCustomerRecord) => defaultCustomerDatabase.addNewCustomer(customer);
export const Customer_GetCustomers = (userID: string) => defaultCustomerDatabase.getCustomers(userID);
export const Customer_GetCustomerByID = (id: string) => defaultCustomerDatabase.getCustomerByID(id);
export const Customer_UpdateCustomerByID = (id: string, customer: BaseCustomerRecord) => defaultCustomerDatabase.updateCustomerByID(id, customer);

// Create a class to handle database operations for appointment-related functions
export class DatabaseAppointmentService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new appointment to the database
	async addNewAppointment(appointment: BaseAppointmentRecord): Promise<boolean> {
		const result = await this.db.collection('appointments').insertOne(appointment);
		return result.acknowledged;
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
	async updateAppointmentByID(id: string, appointment: BaseAppointmentRecord): Promise<boolean> {
		// Use $set to update only the provided fields, preserving other existing fields
		const result = await this.db.collection('appointments').updateOne(
			{ _id: new ObjectId(id) }, 
			{ $set: appointment }
		);
		
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
export const Appointment_UpdateAppointmentByID = (id: string, appointment: BaseAppointmentRecord) => defaultAppointmentDatabase.updateAppointmentByID(id, appointment);
