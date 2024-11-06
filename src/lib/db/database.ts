import type {
	cookie,
	customerRecord,
	userRecord,
	newCustomerRecord,
	newUserRecord,
	newAppointmentRecord,
	appointmentRecord
} from '$lib/types';
import { ObjectId, type Document, type UpdateResult } from 'mongodb';
import { getDB } from './mongo';

// Create a class to handle database operations
export class DatabaseAuthService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	async addNewUser(user: newUserRecord) {
		let result = await this.db.collection('users').insertOne(user);
		return result;
	}

	async getUserByEmail(email: string): Promise<userRecord | undefined> {
		const returnData = await this.db.collection('users').findOne({ email: email });
		if (returnData != null) {
			return <userRecord>returnData;
		} else {
			return undefined;
		}
	}

	async addCookie(cookie: string) {
		await this.db.collection('cookie').insertOne({
			cookie: cookie,
			expireTime: Date.now() + 3600 * 1000
		});
	}

	async removeCookie(cookie: string) {
		await this.db.collection('cookie').deleteOne({ cookie: cookie });
	}

	async getCookie(cookie: string): Promise<cookie> {
		const result = <cookie>(
			(<unknown>await this.db.collection('cookie').findOne({ cookie: cookie }))
		);
		return result;
	}

	async updateCookie(cookie: string) {
		const updateDoc = { $set: { expireTime: Date.now() + 3600 * 1000 } };
		await this.db.collection('cookie').updateOne({ cookie: cookie }, updateDoc);
	}
}

const defaultAuthDatabase = new DatabaseAuthService();

export const Auth_AddNewUser = (user: newUserRecord) => defaultAuthDatabase.addNewUser(user);
export const Auth_GetUserByEmail = (email: string) => defaultAuthDatabase.getUserByEmail(email);
export const Auth_AddCookie = (cookie: string) => defaultAuthDatabase.addCookie(cookie);
export const Auth_RemoveCookie = (cookie: string) => defaultAuthDatabase.removeCookie(cookie);
export const Auth_GetCookie = (cookie: string) => defaultAuthDatabase.getCookie(cookie);
export const Auth_UpdateCookie = (cookie: string) => defaultAuthDatabase.updateCookie(cookie);

export class DatabaseCustomerService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	async addNewCustomer(customer: newCustomerRecord) {
		let result = await this.db.collection('customer').insertOne(customer);
		return result;
	}

	async getCustomers(userID: string): Promise<customerRecord[] | undefined> {
		const returnData = this.db.collection('customer').find({ userID: userID, deleted: false });
		if (returnData != null) {
			return <customerRecord[]>(<unknown>returnData.toArray());
		} else {
			return undefined;
		}
	}

	async getCustomerByID(id: string): Promise<customerRecord | undefined> {
		const returnData = await this.db.collection('customer').findOne({ _id: new ObjectId(id) });

		if (returnData != null) {
			return <customerRecord>returnData;
		} else {
			return undefined;
		}
	}

	async updateCustomerByID(
		id: string,
		customer: newCustomerRecord
	): Promise<UpdateResult<Document>> {
		const returnData = await this.db
			.collection('customer')
			.updateOne({ _id: new ObjectId(id) }, customer);
		return returnData;
	}
}

const defaultCustomerDatabase = new DatabaseCustomerService();

export const Customer_AddNewCustomer = (customer: newCustomerRecord) =>
	defaultCustomerDatabase.addNewCustomer(customer);
export const Customer_GetCustomers = (userID: string) =>
	defaultCustomerDatabase.getCustomers(userID);
export const Customer_GetCustomerByID = (id: string) => defaultCustomerDatabase.getCustomerByID(id);
export const Customer_UpdateCustomerByID = (id: string, customer: newCustomerRecord) =>
	defaultCustomerDatabase.updateCustomerByID(id, customer);




export class DatabaseAppointmentService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	async addNewAppointment(appointment: newAppointmentRecord) {
		let result = await this.db.collection('appointments').insertOne(appointment);
		return result;
	}

	async getAppointmentByID(id: string): Promise<appointmentRecord | undefined> {
		const returnData = await this.db.collection('appointments').findOne({ _id: new ObjectId(id) });
		if (returnData != undefined) {
			return <appointmentRecord>returnData;
		} else {
			return undefined;
		}
	}

	async getAppointmentsByCustomerID(customerID: string): Promise<appointmentRecord[] | undefined> {
		const returnData = this.db
			.collection('appointments')
			.find({ customerID: customerID, deleted: false });
		if (returnData != null) {
			return <appointmentRecord[]>(<unknown>returnData.toArray());
		} else {
			return undefined;
		}
	}

	async getAppointmentsByUserID(userID: string): Promise<appointmentRecord[] | undefined> {
		const returnData = this.db.collection('appointments').find({ userID: userID, deleted: false });
		if (returnData != null) {
			return <appointmentRecord[]>(<unknown>returnData.toArray());
		} else {
			return undefined;
		}
	}

	async updateAppointmentByID(id: string, appointment: newAppointmentRecord) {
		const returnData = this.db
			.collection('appointments')
			.updateOne({ _id: new ObjectId(id) }, appointment);
		return returnData;
	}
}

const defaultAppointmentDatabase = new DatabaseAppointmentService();

export const Appointment_AddNewAppointment = (appointment: newAppointmentRecord) =>
	defaultAppointmentDatabase.addNewAppointment(appointment);
export const Appointment_GetAppointmentByID = (id: string) =>
	defaultAppointmentDatabase.getAppointmentByID(id);
export const Appointment_GetAppointmentsByCustomerID = (id: string) =>
	defaultAppointmentDatabase.getAppointmentsByCustomerID(id);
export const Appointment_GetAppointmentsByUserID = (id: string) =>
	defaultAppointmentDatabase.getAppointmentsByUserID(id);
export const Appointment_UpdateAppointmentByID = (id:string, appointment:newAppointmentRecord) => 
	defaultAppointmentDatabase.updateAppointmentByID(id, appointment)
