import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { DatabaseAuthService, DatabaseCustomerService, DatabaseAppointmentService, DatabaseNoteService } from './database';
import type { CustomerRecord, BaseAppointmentRecord, AppointmentRecord } from '$lib/types';

// Mock Database
vi.mock('better-sqlite3', () => {
	return {
		default: vi.fn(() => ({
			prepare: vi.fn().mockReturnValue({
				run: vi.fn(),
				get: vi.fn(),
				all: vi.fn()
			})
		}))
	};
});

describe('DatabaseAuthService', () => {
	let authService: DatabaseAuthService;
	let mockDb: any;

	beforeEach(() => {
		mockDb = new Database('mydb.sqlite');
		authService = new DatabaseAuthService(mockDb);
	});

	describe('addNewUser', () => {
		it('should add a new user successfully', () => {
			const mockUser = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				hashedPassword: 'hashedPassword'
			};

			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = authService.addNewUser(mockUser);
			expect(result).toBe(true);
			expect(mockDb.prepare).toHaveBeenCalledWith('Insert into users (firstName, lastName, email, hashedPassword, deleted) VALUES (@firstName, @lastName, @email, @hashedPassword, @deleted)');
		});

		it('should return false if user insertion fails', () => {
			const mockUser = {
				id: 1,
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				hashedPassword: 'hashedPassword'
			};

			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = authService.addNewUser(mockUser);
			expect(result).toBe(false);
		});
	});

	describe('getUserByEmail', () => {
		it('should retrieve a user by email', () => {
			const mockUser = {
				id: 1,
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				hashedPassword: 'hashedPassword'
			};

			mockDb.prepare().get.mockReturnValue(mockUser);

			const result = authService.getUserByEmail('john@example.com');
			expect(result).toEqual(mockUser);
		});

		it('should return null if no user is found', () => {
			mockDb.prepare().get.mockReturnValue(null);

			const result = authService.getUserByEmail('nonexistent@example.com');
			expect(result).toBeNull();
		});
	});

	describe('addCookie', () => {
		it('should add a cookie successfully', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = authService.addCookie('testCookie', 1);
			expect(result).toBe(true);
		});

		it('should return false if cookie insertion fails', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = authService.addCookie('testCookie', 1);
			expect(result).toBe(false);
		});
	});

	describe('removeCookie', () => {
		it('should remove a cookie successfully', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = authService.removeCookie('testCookie');
			expect(result).toBe(true);
			expect(mockDb.prepare).toHaveBeenCalledWith('DELETE FROM cookie WHERE id = ?');
		});

		it('should return false if cookie removal fails', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = authService.removeCookie('testCookie');
			expect(result).toBe(false);
		});
	});

	describe('getCookie', () => {
		it('should retrieve a cookie', () => {
			const mockCookie = {
				id: 'testCookie',
				userID: 1,
				expireTime: Date.now() + 3600 * 1000
			};

			mockDb.prepare().get.mockReturnValue(mockCookie);

			const result = authService.getCookie('testCookie');
			expect(result).toEqual(mockCookie);
		});

		it('should return null if no cookie is found', () => {
			mockDb.prepare().get.mockReturnValue(null);

			const result = authService.getCookie('nonexistentCookie');
			expect(result).toBeNull();
		});
	});

	describe('updateCookie', () => {
		it('should update a cookie successfully', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = authService.updateCookie('testCookie');
			expect(result).toBe(true);
			expect(mockDb.prepare).toHaveBeenCalledWith('Update cookie SET expireTime = ? WHERE id = ?');
		});

		it('should return false if cookie update fails', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = authService.updateCookie('testCookie');
			expect(result).toBe(false);
		});
	});
});

describe('DatabaseCustomerService', () => {
	let customerService: DatabaseCustomerService;
	let mockDb: any;

	beforeEach(() => {
		mockDb = new Database('mydb.sqlite');
		customerService = new DatabaseCustomerService(mockDb);
	});

	describe('addNewCustomer', () => {
		it('should add a new customer successfully', () => {
			const mockCustomer: CustomerRecord = {
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Doe',
				email: 'jane@example.com',
				phone: '1234567890',
				address: {
					street: '123 Test St',
					city: 'Testville',
					state: 'TS',
					zip: 12345
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = customerService.addNewCustomer(mockCustomer);
			expect(result).toBe(true);
		});

		it('should return false if customer insertion fails', () => {
			const mockCustomer: CustomerRecord = {
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Doe',
				email: 'jane@example.com',
				phone: '1234567890',
				address: {
					street: '123 Test St',
					city: 'Testville',
					state: 'TS',
					zip: 12345
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = customerService.addNewCustomer(mockCustomer);
			expect(result).toBe(false);
		});
	});

	describe('getCustomers', () => {
		it('should retrieve customers for a user', () => {
			const mockCustomers = [
				{
					id: 1,
					userID: 1,
					firstName: 'Jane',
					lastName: 'Doe',
					email: 'jane@example.com',
					phone: '1234567890',
					address_street: '123 Test St',
					address_city: 'Testville',
					address_state: 'TS',
					address_zip: 12345,
					deleted: 0
				}
			];

			mockDb.prepare().all.mockReturnValue(mockCustomers);

			const result = customerService.getCustomers(1);
			expect(result).toHaveLength(1);
			expect(result?.[0]).toEqual({
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Doe',
				email: 'jane@example.com',
				phone: '1234567890',
				address: {
					street: '123 Test St',
					city: 'Testville',
					state: 'TS',
					zip: 12345
				},
				deleted: 0
			});
		});

		it('should return null if no customers are found', () => {
			mockDb.prepare().all.mockReturnValue(null);

			const result = customerService.getCustomers(1);
			expect(result).toBeNull();
		});
	});

	describe('getCustomerByID', () => {
		it('should retrieve a customer by ID', () => {
			const mockCustomer = {
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Doe',
				email: 'jane@example.com',
				phone: '1234567890',
				address_street: '123 Test St',
				address_city: 'Testville',
				address_state: 'TS',
				address_zip: 12345,
				deleted: 0
			};

			mockDb.prepare().get.mockReturnValue(mockCustomer);

			const result = customerService.getCustomerByID(1);
			expect(result).toEqual({
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Doe',
				email: 'jane@example.com',
				phone: '1234567890',
				address: {
					street: '123 Test St',
					city: 'Testville',
					state: 'TS',
					zip: 12345
				},
				deleted: 0
			});
		});

		it('should return null if no customer is found', () => {
			mockDb.prepare().get.mockReturnValue(null);

			const result = customerService.getCustomerByID(1);
			expect(result).toBeNull();
		});
	});

	describe('updateCustomerByID', () => {
		it('should update a customer successfully', () => {
			const mockCustomer: CustomerRecord = {
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@example.com',
				phone: '0987654321',
				address: {
					street: '456 New St',
					city: 'Newville',
					state: 'NS',
					zip: 54321
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = customerService.updateCustomerByID(1, mockCustomer);
			expect(result).toBe(true);
		});

		it('should return false if customer update fails', () => {
			const mockCustomer: CustomerRecord = {
				id: 1,
				userID: 1,
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@example.com',
				phone: '0987654321',
				address: {
					street: '456 New St',
					city: 'Newville',
					state: 'NS',
					zip: 54321
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = customerService.updateCustomerByID(1, mockCustomer);
			expect(result).toBe(false);
		});
	});

	describe('deleteCustomerByID', () => {
		it('should delete a customer successfully', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = customerService.deleteCustomerByID(1);
			expect(result).toBe(true);
		});

		it('should return false if customer deletion fails', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = customerService.deleteCustomerByID(1);
			expect(result).toBe(false);
		});
	});
});

describe('DatabaseAppointmentService', () => {
	let appointmentService: DatabaseAppointmentService;
	let mockDb: any;

	beforeEach(() => {
		mockDb = new Database('mydb.sqlite');
		appointmentService = new DatabaseAppointmentService(mockDb);
	});

	describe('addNewAppointment', () => {
		it('should add a new appointment successfully', () => {
			const mockAppointment: BaseAppointmentRecord = {
				userID: 1,
				customerID: 1,
				title: 'Pet Grooming',
				description: 'Regular grooming session',
				time: {
					date: '2023-06-15',
					start: '10:00',
					end: '11:00',
					exact: 1
				},
				address: {
					street: '123 Pet St',
					city: 'Petville',
					state: 'PS',
					zip: 12345
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = appointmentService.addNewAppointment(mockAppointment);
			expect(result).toBe(true);
		});

		it('should return false if appointment insertion fails', () => {
			const mockAppointment: BaseAppointmentRecord = {
				userID: 1,
				customerID: 1,
				title: 'Pet Grooming',
				description: 'Regular grooming session',
				time: {
					date: '2023-06-15',
					start: '10:00',
					end: '11:00',
					exact: 1
				},
				address: {
					street: '123 Pet St',
					city: 'Petville',
					state: 'PS',
					zip: 12345
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = appointmentService.addNewAppointment(mockAppointment);
			expect(result).toBe(false);
		});
	});

	describe('getAppointmentByID', () => {
		it('should retrieve an appointment by ID', () => {
			const mockAppointment = {
				id: 1,
				userID: 1,
				customerID: 1,
				title: 'Pet Grooming',
				description: 'Regular grooming session',
				time_date: '2023-06-15',
				time_start: '10:00',
				time_end: '11:00',
				time_exact: 1,
				address_street: '123 Pet St',
				address_city: 'Petville',
				address_state: 'PS',
				address_zip: 12345,
				deleted: 0
			};

			mockDb.prepare().get.mockReturnValue(mockAppointment);

			const result = appointmentService.getAppointmentByID(1);
			expect(result).toEqual({
				id: 1,
				userID: 1,
				customerID: 1,
				title: 'Pet Grooming',
				description: 'Regular grooming session',
				time: {
					date: '2023-06-15',
					start: '10:00',
					end: '11:00',
					exact: 1
				},
				address: {
					street: '123 Pet St',
					city: 'Petville',
					state: 'PS',
					zip: 12345
				},
				deleted: 0
			});
		});

		it('should return null if no appointment is found', () => {
			mockDb.prepare().get.mockReturnValue(null);

			const result = appointmentService.getAppointmentByID(1);
			expect(result).toBeNull();
		});
	});

	describe('getAppointmentsByCustomerID', () => {
		it('should retrieve appointments for a customer', () => {
			const mockAppointments = [
				{
					id: 1,
					userID: 1,
					customerID: 1,
					title: 'Pet Grooming',
					description: 'Regular grooming session',
					time_date: '2023-06-15',
					time_start: '10:00',
					time_end: '11:00',
					time_exact: 1,
					address_street: '123 Pet St',
					address_city: 'Petville',
					address_state: 'PS',
					address_zip: 12345,
					deleted: 0
				}
			];

			mockDb.prepare().all.mockReturnValue(mockAppointments);

			const result = appointmentService.getAppointmentsByCustomerID(1);
			expect(result).toHaveLength(1);
			expect(result?.[0]).toEqual({
				id: 1,
				userID: 1,
				customerID: 1,
				title: 'Pet Grooming',
				description: 'Regular grooming session',
				time: {
					date: '2023-06-15',
					start: '10:00',
					end: '11:00',
					exact: 1
				},
				address: {
					street: '123 Pet St',
					city: 'Petville',
					state: 'PS',
					zip: 12345
				},
				deleted: 0
			});
		});

		it('should return null if no appointments are found', () => {
			mockDb.prepare().all.mockReturnValue(null);

			const result = appointmentService.getAppointmentsByCustomerID(1);
			expect(result).toBeNull();
		});
	});

	describe('getAppointmentsByUserID', () => {
		it('should retrieve appointments for a user', () => {
			const mockAppointments = [
				{
					id: 1,
					userID: 1,
					customerID: 1,
					title: 'Pet Grooming',
					description: 'Regular grooming session',
					time_date: '2023-06-15',
					time_start: '10:00',
					time_end: '11:00',
					time_exact: 1,
					address_street: '123 Pet St',
					address_city: 'Petville',
					address_state: 'PS',
					address_zip: 12345,
					deleted: 0
				}
			];

			mockDb.prepare().all.mockReturnValue(mockAppointments);

			const result = appointmentService.getAppointmentsByUserID(1);
			expect(result).toHaveLength(1);
			expect(result?.[0]).toEqual({
				id: 1,
				userID: 1,
				customerID: 1,
				title: 'Pet Grooming',
				description: 'Regular grooming session',
				time: {
					date: '2023-06-15',
					start: '10:00',
					end: '11:00',
					exact: 1
				},
				address: {
					street: '123 Pet St',
					city: 'Petville',
					state: 'PS',
					zip: 12345
				},
				deleted: 0
			});
		});

		it('should return null if no appointments are found', () => {
			mockDb.prepare().all.mockReturnValue(null);

			const result = appointmentService.getAppointmentsByUserID(1);
			expect(result).toBeNull();
		});
	});

	describe('updateAppointmentByID', () => {
		it('should update an appointment successfully', async () => {
			const mockAppointment: AppointmentRecord = {
				id: 1,
				userID: 1,
				customerID: 1,
				title: 'Updated Pet Grooming',
				description: 'Updated grooming session',
				time: {
					date: '2023-06-16',
					start: '11:00',
					end: '12:00',
					exact: 1
				},
				address: {
					street: '456 New Pet St',
					city: 'New Petville',
					state: 'NP',
					zip: 54321
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = await appointmentService.updateAppointmentByID(1, mockAppointment);
			expect(result).toBe(true);
		});

		it('should return false if appointment update fails', async () => {
			const mockAppointment: AppointmentRecord = {
				id: 1,
				userID: 1,
				customerID: 1,
				title: 'Updated Pet Grooming',
				description: 'Updated grooming session',
				time: {
					date: '2023-06-16',
					start: '11:00',
					end: '12:00',
					exact: 1
				},
				address: {
					street: '456 New Pet St',
					city: 'New Petville',
					state: 'NP',
					zip: 54321
				},
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = await appointmentService.updateAppointmentByID(1, mockAppointment);
			expect(result).toBe(false);
		});
	});

	describe('deleteAppointmentByID', () => {
		it('should delete an appointment successfully', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = appointmentService.deleteAppointmentByID(1);
			expect(result).toBe(true);
		});

		it('should return false if appointment deletion fails', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = appointmentService.deleteAppointmentByID(1);
			expect(result).toBe(false);
		});
	});
});

describe('DatabaseNoteService', () => {
	let noteService: DatabaseNoteService;
	let mockDb: any;

	beforeEach(() => {
		mockDb = new Database('mydb.sqlite');
		noteService = new DatabaseNoteService(mockDb);
	});

	describe('CreateNote', () => {
		it('should create a new note and return the inserted row ID', () => {
			const mockNote = {
				title: 'Test Note',
				note: 'This is a test note',
				createdDate: '2023-06-20'
			};

			mockDb.prepare().run.mockReturnValue({ lastInsertRowid: 1 });

			const result = noteService['CreateNote'](mockNote);
			expect(result).toBe(1);
			expect(mockDb.prepare).toHaveBeenCalledWith('INSERT into notes (title, note, createdDate, deleted) VALUES (@title, @note, @createdDate, @deleted)');
		});
	});

	describe('CreateCustomerNote', () => {
		it('should create a customer note successfully', () => {
			const mockNote = {
				title: 'Customer Note',
				note: 'This is a customer note',
				createdDate: '2023-06-20'
			};

			mockDb.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });
			mockDb.prepare().run.mockReturnValueOnce({ changes: 1 });

			const result = noteService.CreateCustomerNote(1, mockNote);
			expect(result).toBe(true);
		});

		it('should return false if customer note creation fails', () => {
			const mockNote = {
				title: 'Customer Note',
				note: 'This is a customer note',
				createdDate: '2023-06-20'
			};

			mockDb.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });
			mockDb.prepare().run.mockReturnValueOnce({ changes: 0 });

			const result = noteService.CreateCustomerNote(1, mockNote);
			expect(result).toBe(false);
		});
	});

	describe('GetCustomerNotes', () => {
		it('should retrieve customer notes successfully', () => {
			const mockNotes = [
				{
					id: 1,
					title: 'Customer Note 1',
					note: 'First customer note',
					createdDate: '2023-06-20',
					deleted: 0
				},
				{
					id: 2,
					title: 'Customer Note 2',
					note: 'Second customer note',
					createdDate: '2023-06-21',
					deleted: 0
				}
			];

			mockDb.prepare().all.mockReturnValue(mockNotes);

			const result = noteService.GetCustomerNotes(1);
			expect(result).toEqual(mockNotes);
		});

		it('should return an empty array if no customer notes are found', () => {
			mockDb.prepare().all.mockReturnValue(undefined);

			const result = noteService.GetCustomerNotes(1);
			expect(result).toEqual([]);
		});
	});

	describe('GetNoteByID', () => {
		it('should retrieve a note by ID successfully', () => {
			const mockNote = {
				id: 1,
				title: 'Test Note',
				note: 'This is a test note',
				createdDate: '2023-06-20',
				deleted: 0
			};

			mockDb.prepare().get.mockReturnValue(mockNote);

			const result = noteService.GetNoteByID(1);
			expect(result).toEqual(mockNote);
		});

		it('should return null if no note is found', () => {
			mockDb.prepare().get.mockReturnValue(undefined);

			const result = noteService.GetNoteByID(1);
			expect(result).toBeNull();
		});
	});

	describe('CreateAppointmentNote', () => {
		it('should create an appointment note successfully', () => {
			const mockNote = {
				title: 'Appointment Note',
				note: 'This is an appointment note',
				createdDate: '2023-06-20'
			};

			mockDb.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });
			mockDb.prepare().run.mockReturnValueOnce({ changes: 1 });

			const result = noteService.CreateAppointmentNote(1, mockNote);
			expect(result).toBe(true);
		});

		it('should return false if appointment note creation fails', () => {
			const mockNote = {
				title: 'Appointment Note',
				note: 'This is an appointment note',
				createdDate: '2023-06-20'
			};

			mockDb.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });
			mockDb.prepare().run.mockReturnValueOnce({ changes: 0 });

			const result = noteService.CreateAppointmentNote(1, mockNote);
			expect(result).toBe(false);
		});
	});

	describe('GetAppointmentNotes', () => {
		it('should retrieve appointment notes successfully', () => {
			const mockNotes = [
				{
					id: 1,
					title: 'Appointment Note 1',
					note: 'First appointment note',
					createdDate: '2023-06-20',
					deleted: 0
				},
				{
					id: 2,
					title: 'Appointment Note 2',
					note: 'Second appointment note',
					createdDate: '2023-06-21',
					deleted: 0
				}
			];

			mockDb.prepare().all.mockReturnValue(mockNotes);

			const result = noteService.GetAppointmentNotes(1);
			expect(result).toEqual(mockNotes);
		});

		it('should return an empty array if no appointment notes are found', () => {
			mockDb.prepare().all.mockReturnValue(undefined);

			const result = noteService.GetAppointmentNotes(1);
			expect(result).toEqual([]);
		});
	});

	describe('UpdateNotesByID', () => {
		it('should update a note successfully', () => {
			const mockNote = {
				id: 1,
				title: 'Updated Note',
				note: 'This is an updated note',
				createdDate: '2023-06-20',
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = noteService.UpdateNotesByID(mockNote);
			expect(result).toBe(true);
		});

		it('should return false if note update fails', () => {
			const mockNote = {
				id: 1,
				title: 'Updated Note',
				note: 'This is an updated note',
				createdDate: '2023-06-20',
				deleted: 0
			};

			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = noteService.UpdateNotesByID(mockNote);
			expect(result).toBe(false);
		});
	});

	describe('DeleteNoteByID', () => {
		it('should delete a note successfully', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 1 });

			const result = noteService.DeleteNoteByID(1);
			expect(result).toBe(true);
		});

		it('should return false if note deletion fails', () => {
			mockDb.prepare().run.mockReturnValue({ changes: 0 });

			const result = noteService.DeleteNoteByID(1);
			expect(result).toBe(false);
		});
	});
});
