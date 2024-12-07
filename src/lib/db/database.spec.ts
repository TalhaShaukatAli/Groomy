import { describe, expect, beforeEach, afterEach, vi, it } from 'vitest';
import type { BaseUserRecord, CustomerRecord, BaseAppointmentRecord, BaseServiceRecord, BaseNote } from '$lib/types';

// Get the mock functions before the module is mocked
const mockedDB = vi.hoisted(() => ({
	mockRun: vi.fn(),
	mockGet: vi.fn(),
	mockAll: vi.fn(),
	mockPrepare: vi.fn()
}));

// Mock needs to be first, with all mocked functionality defined inside it
vi.mock('better-sqlite3', () => {
	const mockPrepare = vi.fn(() => ({
		run: mockedDB.mockRun,
		get: mockedDB.mockGet,
		all: mockedDB.mockAll
	}));

	return {
		default: vi.fn(() => ({
			prepare: mockPrepare,
			close: vi.fn()
		}))
	};
});

// Import your database services after the mock setup
import { AuthService, CustomerService, AppointmentService, ServiceService, NoteService } from './database';

// Create instances for testing
const AuthDatabaseService = new AuthService();
const CustomerDatabaseService = new CustomerService();
const AppointmentDatabaseService = new AppointmentService();
const ServiceDatabaseService = new ServiceService();
const NoteDatabaseService = new NoteService();

beforeEach(() => {
	vi.clearAllMocks();

	// Reset the mocks
	mockedDB.mockRun.mockReset();
	mockedDB.mockGet.mockReset();
	mockedDB.mockAll.mockReset();
	mockedDB.mockPrepare.mockReset();

	// Set default successful response for database initialization
	mockedDB.mockRun.mockReturnValue({ changes: 0, lastInsertRowid: 0 });
});

afterEach(() => {
	vi.clearAllMocks();
});

describe('AuthDatabaseService', () => {
	describe('createUser', () => {
		it('should successfully create a user when email is not in use', () => {
			// Mock getUserByEmail to return failure (email not found)
			mockedDB.mockGet.mockReturnValueOnce(null);

			// Mock run to simulate successful user creation
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1, lastInsertRowid: 1 });

			const user: BaseUserRecord = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				hashedPassword: 'hashedpassword'
			};

			const result = AuthDatabaseService.createUser(user);

			expect(result.success).toBe(true);
			expect(result.message).toBe('User was created successfully');
		});

		it('should fail to create a user when email is already in use', () => {
			// Mock getUserByEmail to return an existing user
			mockedDB.mockGet.mockReturnValueOnce({ id: 1, email: 'john@example.com' });

			const user: BaseUserRecord = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				hashedPassword: 'hashedpassword'
			};

			const result = AuthDatabaseService.createUser(user);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Email already in use');
		});
	});

	describe('getUserByEmail', () => {
		it('should retrieve a user successfully', () => {
			const mockUser = {
				id: 1,
				email: 'john@example.com',
				firstName: 'John',
				lastName: 'Doe',
				hashedPassword: 'hashedpassword',
				deleted: 0
			};
			mockedDB.mockGet.mockReturnValueOnce(mockUser);

			const result = AuthDatabaseService.getUserByEmail('john@example.com');

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockUser);
		});

		it('should fail to retrieve a non-existent user', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			const result = AuthDatabaseService.getUserByEmail('nonexistent@example.com');

			expect(result.success).toBe(false);
			expect(result.message).toBe("Couldn't find user");
		});
	});

	describe('createCookie', () => {
		it('should successfully create a cookie', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1, lastInsertRowid: 1 });

			const result = AuthDatabaseService.createCookie('testcookie', 1);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Successful cookie creation');
		});

		it('should fail to create a cookie', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

			const result = AuthDatabaseService.createCookie('testcookie', 1);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed cookie creation');
		});
	});
});

describe('CustomerDatabaseService', () => {
	describe('createCustomer', () => {
		it('should successfully create a customer', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1, lastInsertRowid: 1 });

			const customer: CustomerRecord = {
				id: 0,
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

			const result = CustomerDatabaseService.createCustomer(customer);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Created customer successfully');
		});

		it('should fail to create a customer', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

			const customer: CustomerRecord = {
				id: 0,
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

			const result = CustomerDatabaseService.createCustomer(customer);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to create customer');
		});
	});

	describe('getCustomers', () => {
		it('should retrieve customers successfully', () => {
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
			mockedDB.mockAll.mockReturnValueOnce(mockCustomers);

			const result = CustomerDatabaseService.getCustomers(1);

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data!.length).toBe(1);
			expect(result.data![0].firstName).toBe('Jane');
		});

		it('should handle no customers found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = CustomerDatabaseService.getCustomers(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to get customers');
		});
	});
});

describe('AppointmentDatabaseService', () => {
	describe('createAppointment', () => {
		it('should successfully create an appointment', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1, lastInsertRowid: 1 });

			const appointment: BaseAppointmentRecord = {
				userID: 1,
				customerID: 1,
				title: 'Test Appointment',
				description: 'A test appointment',
				time: {
					date: '2023-01-01',
					start: '10:00',
					end: '11:00',
					exact: 0
				},
				address: {
					street: '123 Test St',
					city: 'Testville',
					state: 'TS',
					zip: 12345
				},
				deleted: 0
			};

			const result = AppointmentDatabaseService.createAppointment(appointment);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Appointment created');
		});

		it('should fail to create an appointment', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

			const appointment: BaseAppointmentRecord = {
				userID: 1,
				customerID: 1,
				title: 'Test Appointment',
				description: 'A test appointment',
				time: {
					date: '2023-01-01',
					start: '10:00',
					end: '11:00',
					exact: 0
				},
				address: {
					street: '123 Test St',
					city: 'Testville',
					state: 'TS',
					zip: 12345
				},
				deleted: 0
			};

			const result = AppointmentDatabaseService.createAppointment(appointment);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Appointment creation failed');
		});
	});

	describe('getAppointmentsByUserID', () => {
		it('should retrieve appointments successfully', () => {
			const mockAppointments = [
				{
					id: 1,
					userID: 1,
					customerID: 1,
					title: 'Test Appointment',
					description: 'A test appointment',
					time_date: '2023-01-01',
					time_start: '10:00',
					time_end: '11:00',
					time_exact: 0,
					address_street: '123 Test St',
					address_city: 'Testville',
					address_state: 'TS',
					address_zip: 12345,
					deleted: 0
				}
			];
			mockedDB.mockAll.mockReturnValueOnce(mockAppointments);

			const result = AppointmentDatabaseService.getAppointmentsByUserID(1);

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data!.length).toBe(1);
			expect(result.data![0].title).toBe('Test Appointment');
		});

		it('should handle no appointments found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = AppointmentDatabaseService.getAppointmentsByUserID(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Appointments couldn't be found");
		});
	});
});

describe('ServiceDatabaseService', () => {
	describe('createService', () => {
		it('should successfully create a service', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1, lastInsertRowid: 1 });

			const service: BaseServiceRecord = {
				userID: 1,
				name: 'Test Service',
				description: 'A test service',
				price: 50.0,
				deleted: 0
			};

			const result = ServiceDatabaseService.createService(service);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Service created');
		});

		it('should fail to create a service', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

			const service: BaseServiceRecord = {
				userID: 1,
				name: 'Test Service',
				description: 'A test service',
				price: 50.0,
				deleted: 0
			};

			const result = ServiceDatabaseService.createService(service);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Service couldn't be created");
		});
	});

	describe('getServicesByUserID', () => {
		it('should retrieve services successfully', () => {
			const mockServices = [
				{
					id: 1,
					userID: 1,
					name: 'Test Service',
					description: 'A test service',
					price: 50.0,
					deleted: 0
				}
			];
			mockedDB.mockAll.mockReturnValueOnce(mockServices);

			const result = ServiceDatabaseService.getServicesByUserID(1);

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data!.length).toBe(1);
			expect(result.data![0].name).toBe('Test Service');
		});

		it('should handle no services found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = ServiceDatabaseService.getServicesByUserID(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Service wasn't found");
		});
	});
});

describe('NoteDatabaseService', () => {
	describe('CreateNote', () => {
		it('should successfully create a note', () => {
			mockedDB.mockRun.mockReturnValueOnce({
				changes: 1,
				lastInsertRowid: 1
			});

			const note: BaseNote = {
				title: 'Test Note',
				note: 'A test note content',
				createdDate: Date.now(),
				deleted: 0
			};

			// Use reflection to access the private method
			const createNoteMethod = (NoteDatabaseService as any).CreateNote.bind(NoteDatabaseService);
			const result = createNoteMethod(note);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Note was created');
			expect(result.data).toBe(1);
		});

		it('should fail to create a note', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

			const note: BaseNote = {
				title: 'Test Note',
				note: 'A test note content',
				createdDate: Date.now(),
				deleted: 0
			};

			// Use reflection to access the private method
			const createNoteMethod = (NoteDatabaseService as any).CreateNote.bind(NoteDatabaseService);
			const result = createNoteMethod(note);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Note failed to create');
		});
	});

	describe('CreateCustomerNote', () => {
		it('should successfully create a customer note', () => {
			// Mock the CreateNote method to return success
			const createNoteMock = vi.spyOn(NoteDatabaseService as any, 'CreateNote').mockReturnValueOnce({
				success: true,
				data: 1
			});

			// Mock the run method for the customer_notes insert
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1, lastInsertRowid: 1 });

			const note: BaseNote = {
				title: 'Customer Test Note',
				note: 'A test note for a customer',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.CreateCustomerNote(1, note);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Note created');

			// Restore the original method
			createNoteMock.mockRestore();
		});

		it('should fail to create a customer note', () => {
			// Mock the CreateNote method to return failure
			const createNoteMock = vi.spyOn(NoteDatabaseService as any, 'CreateNote').mockReturnValueOnce({
				success: false,
				message: 'Note failed to create'
			});

			const note: BaseNote = {
				title: 'Customer Test Note',
				note: 'A test note for a customer',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.CreateCustomerNote(1, note);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Notes couldn't be found");

			// Restore the original method
			createNoteMock.mockRestore();
		});
	});
});
