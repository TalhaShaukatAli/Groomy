import type { cookie, CustomerRecord, BaseUserRecord, BaseAppointmentRecord, AppointmentRecord, UserRecord, Note, BaseNote } from '$lib/types';
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
	const db = Database('mydb.sqlite', { verbose: console.log });
	db.pragma('journal_mode = WAL');
	return db;
}

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

export class DatabaseAuthService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	// Add a new user to the database
	addNewUser(user: BaseUserRecord): boolean {
		const query = this.db.prepare('Insert into users (firstName, lastName, email, hashedPassword, deleted) VALUES (@firstName, @lastName, @email, @hashedPassword, @deleted)');
		let result = query.run({ firstName: user.firstName, lastName: user.lastName, email: user.email, hashedPassword: user.hashedPassword, deleted: 0 });
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
		const query = this.db.prepare('DELETE FROM cookie WHERE id = ?');
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
		const query = this.db.prepare('UPDATE customers SET deleted = 1 WHERE id = ?');
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

	private AppointmentDatabaseResponseToAppointmentRecord(record: DatabaseAppointmentResponse): AppointmentRecord {
		let returnData: AppointmentRecord = {
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
			for (let item of result) {
				let data = this.AppointmentDatabaseResponseToAppointmentRecord(item);
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
			for (let item of result) {
				let data = this.AppointmentDatabaseResponseToAppointmentRecord(item);
				resultArray.push(data);
			}
			return resultArray;
		} else {
			return null;
		}
	}

	// Update an appointment's information by its ID
	async updateAppointmentByID(id: number, appointment: AppointmentRecord): Promise<boolean> {
		console.log(appointment);
		const query = this.db.prepare(
			'Update appointments set userID = @userID, customerID=@customerID, title=@title, description=@description, address_street= @address_street, address_city=@address_city, address_state=@address_state, address_zip=@address_zip, time_date = @time_date, time_start = @time_start, time_end = @time_end, time_exact = @time_exact, deleted=@deleted where id = @id'
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

	private CreateNote(noteData:BaseNote):number{
		const query = this.db.prepare("INSERT into notes (title, note, createdDate, deleted) VALUES (@title, @note, @createdDate, @deleted)")
		const result = query.run({
			title: noteData.title,
			note: noteData.note,
			createdDate: noteData.createdDate,
			deleted: 0
		})
		return <number>result.lastInsertRowid
	}

	CreateCustomerNote(customerID: number, noteData: BaseNote){
		let noteID = this.CreateNote(noteData)
		const query = this.db.prepare("INSERT into customer_notes (customerID, noteID) VALUES (@customerID, @noteID)")
		const result = query.run({
			customerID: customerID,
			noteID: noteID
		})
		if(result.changes){
			return true
		} else {
			return false
		}
	}

	GetCustomerNotes(customerID: number): Note[] {
		const query = this.db.prepare('Select n.* FROM customer_notes cn INNER JOIN notes n ON cn.noteID = n.id WHERE cn.customerID = ? and deleted = 0');
		const result = query.all(customerID);
		if(result == undefined){
			return []
		} else {
			return <Note[]>result;
		}
	}

	GetNoteByID(noteID: number): Note | null {
		const query = this.db.prepare('Select * FROM notes WHERE id = ?');
		const result = query.get(noteID);
		if(result == undefined){
			return null
		} else {
			return <Note>result;
		}
	}

	CreateAppointmentNote(appointmentID: number, noteData: BaseNote){
		let noteID = this.CreateNote(noteData)
		const query = this.db.prepare("INSERT into appointment_notes (appointmentID, noteID) VALUES (@appointmentID, @noteID)")
		const result = query.run({
			appointmentID: appointmentID,
			noteID: noteID,
		})
		
		if(result.changes){
			return true
		} else {
			return false
		}
	}

	GetAppointmentNotes(appointmentID: number): Note[] {
		const query = this.db.prepare('SELECT n.* FROM appointment_notes an INNER JOIN notes n ON an.noteID = n.id WHERE an.appointmentID = ? and deleted = 0');
		const result = query.all(appointmentID);
		if(result == undefined){
			return []
		} else {
			return <Note[]>result;
		}
	}

	UpdateNotesByID(note:Note): boolean {
		const query = this.db.prepare('Update notes SET title = @title, note = @note WHERE id = @id');
		const result = query.run({
			title: note.title,
			note:note.note,
			id: note.id
		});
		if(result.changes){
			return true
		} else {
			return false
		}
	}

	DeleteNoteByID(noteID:number):boolean {
		const query = this.db.prepare('Update notes SET deleted = 1 WHERE id = ?');
		const result = query.run(noteID);
		if(result.changes){
			return true
		} else {
			return false
		}
	}
}

const defaultNoteDatabase = new DatabaseNoteService();

export const Notes_CreateAppointmentNote = (appointmentID: number, noteData: BaseNote ) => defaultNoteDatabase.CreateAppointmentNote(appointmentID, noteData)
export const Notes_CreateCustomerNote = (customerID: number, noteData: BaseNote ) => defaultNoteDatabase.CreateAppointmentNote(customerID, noteData)
export const Notes_GetAppointmentNotes = (appointmentID: number) => defaultNoteDatabase.GetAppointmentNotes(appointmentID)
export const Notes_GetCustomerNotes = (customerID: number) => defaultNoteDatabase.GetCustomerNotes(customerID)
export const Notes_UpdateNotesByID = (note: Note) => defaultNoteDatabase.UpdateNotesByID(note)
export const Notes_GetNoteByID = (noteID: number) => defaultNoteDatabase.GetNoteByID(noteID)
export const Notes_DeleteNoteByID = (noteID: number) => defaultNoteDatabase.DeleteNoteByID(noteID	)