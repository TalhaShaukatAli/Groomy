import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BaseAppointmentRecord, BaseNote, BaseServiceRecord, BaseUserRecord, CustomerRecord } from '$lib/types';
// Import database services after the mock setup
import { AppointmentService, AuthService, CustomerService, NoteService, ServiceService } from './database';

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

		it('should fail to create a user', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			mockedDB.mockGet.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

			const user: BaseUserRecord = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				hashedPassword: 'hashedpassword'
			};

			const result = AuthDatabaseService.createUser(user);

			expect(result.success).toBe(false);
			expect(result.message).toBe('User creation failed');
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

	describe('removeCookie', () => {
		it('should successfully remove a cookie', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const result = AuthDatabaseService.removeCookie('test-cookie-id');

			expect(result.success).toBe(true);
			expect(result.message).toBe('Successful cookie deletion');
		});

		it('should fail to remove a non-existent cookie', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const result = AuthDatabaseService.removeCookie('non-existent-cookie');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed cookie deletion');
		});
	});

	describe('getCookie', () => {
		it('should successfully retrieve a cookie', () => {
			const mockCookie = {
				id: 'test-cookie-id',
				userID: 1,
				expireTime: Date.now()
			};
			mockedDB.mockGet.mockReturnValueOnce(mockCookie);

			const result = AuthDatabaseService.getCookie('test-cookie-id');

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockCookie);
		});

		it('should fail to retrieve a non-existent cookie', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			const result = AuthDatabaseService.getCookie('non-existent-cookie');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to find cookie');
		});
	});

	describe('updateCookie', () => {
		it('should successfully update a cookie', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const result = AuthDatabaseService.updateCookie('test-cookie-id');

			expect(result.success).toBe(true);
			expect(result.message).toBe('Updated cookie successfully');
		});

		it('should fail to update a non-existent cookie', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const result = AuthDatabaseService.updateCookie('non-existent-cookie');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to update cookie');
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

	describe('getCustomer', () => {
		it('should successfully retrieve a customer', () => {
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
			mockedDB.mockGet.mockReturnValueOnce(mockCustomer);

			const result = CustomerDatabaseService.getCustomer(1);

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data!.firstName).toBe('Jane');
		});

		it('should fail to retrieve a non-existent customer', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			const result = CustomerDatabaseService.getCustomer(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to get customer');
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

	describe('updateCustomer', () => {
		it('should successfully update a customer', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const customer: CustomerRecord = {
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

			const result = CustomerDatabaseService.updateCustomer(1, customer);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Updated customer successfully');
		});

		it('should fail to update a non-existent customer', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const customer: CustomerRecord = {
				id: 999,
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

			const result = CustomerDatabaseService.updateCustomer(999, customer);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to update customer');
		});
	});

	describe('deleteCustomer', () => {
		it('should successfully delete a customer', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const result = CustomerDatabaseService.deleteCustomer(1);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Customer was deleted successfully');
		});

		it('should fail to delete a non-existent customer', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const result = CustomerDatabaseService.deleteCustomer(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Failed to delete customer');
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

	describe('getAppointment', () => {
		it('should retrieve appointments successfully', () => {
			const mockAppointment = {
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
			};

			mockedDB.mockGet.mockReturnValueOnce(mockAppointment);

			const result = AppointmentDatabaseService.getAppointment(1);
			console.log(result);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data!.title).toBe('Test Appointment');
		});

		it('should handle no appointments found', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			const result = AppointmentDatabaseService.getAppointment(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Appointment couldn't be found");
		});
	});

	describe('getAppointmentsByCustomerID', () => {
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

			const result = AppointmentDatabaseService.getAppointmentsByCustomerID(1);

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data![0].title).toBe('Test Appointment');
		});

		it('should handle no appointments found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = AppointmentDatabaseService.getAppointmentsByCustomerID(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Appointments couldn't be found");
		});
	});

	describe('updateAppointmentByID', () => {
		it('should successfully update an appointment', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const appointment: BaseAppointmentRecord = {
				userID: 1,
				customerID: 1,
				title: 'Updated Appointment',
				description: 'An updated test appointment',
				time: {
					date: '2023-01-01',
					start: '11:00',
					end: '12:00',
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

			const result = AppointmentDatabaseService.updateAppointmentByID(1, appointment);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Appointment was updated');
		});

		it('should fail to update a non-existent appointment', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const appointment: BaseAppointmentRecord = {
				userID: 1,
				customerID: 1,
				title: 'Updated Appointment',
				description: 'An updated test appointment',
				time: {
					date: '2023-01-01',
					start: '11:00',
					end: '12:00',
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

			const result = AppointmentDatabaseService.updateAppointmentByID(999, appointment);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Appointment couldn't be updated");
		});
	});

	describe('deleteAppointment', () => {
		it('should successfully delete an appointment', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const result = AppointmentDatabaseService.deleteAppointment(1);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Appointment was deleted');
		});

		it('should fail to delete a non-existent appointment', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const result = AppointmentDatabaseService.deleteAppointment(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Appointment couldn't be deleted");
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

	describe('getService', () => {
		it('should successfully retrieve a service', () => {
			const mockService = {
				id: 1,
				userID: 1,
				name: 'Test Service',
				description: 'A test service',
				price: 50.0,
				deleted: 0
			};
			mockedDB.mockGet.mockReturnValueOnce(mockService);

			const result = ServiceDatabaseService.getService(1);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockService);
		});

		it('should fail to retrieve a non-existent service', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			const result = ServiceDatabaseService.getService(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Service wasn't found");
		});
	});

	describe('updateServiceByID', () => {
		it('should successfully update a service', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const service: BaseServiceRecord = {
				userID: 1,
				name: 'Updated Service',
				description: 'An updated test service',
				price: 75.0,
				deleted: 0
			};

			const result = ServiceDatabaseService.updateServiceByID(1, service);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Service was updated');
		});

		it('should fail to update a non-existent service', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const service: BaseServiceRecord = {
				userID: 1,
				name: 'Updated Service',
				description: 'An updated test service',
				price: 75.0,
				deleted: 0
			};

			const result = ServiceDatabaseService.updateServiceByID(999, service);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Service wasn't updated");
		});
	});

	describe('deleteService', () => {
		it('should successfully delete a service', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const result = ServiceDatabaseService.deleteService(1);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Service was deleted');
		});

		it('should fail to delete a non-existent service', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const result = ServiceDatabaseService.deleteService(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Service wasn't updated");
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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const createNoteMethod = (NoteDatabaseService as any).CreateNote.bind(NoteDatabaseService);
			const result = createNoteMethod(note);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Note failed to create');
		});
	});

	describe('CreateCustomerNote', () => {
		it('should successfully create a customer note', () => {
			// Mock the CreateNote method to return success
			const createNoteMock = vi.spyOn(NoteDatabaseService as never, 'CreateNote').mockReturnValueOnce({
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
			const createNoteMock = vi.spyOn(NoteDatabaseService as never, 'CreateNote').mockReturnValueOnce({
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

	describe('GetNoteByID', () => {
		it('should successfully retrieve a note', () => {
			const mockNote = {
				id: 1,
				title: 'Test Note',
				note: 'Test note content',
				createdDate: Date.now(),
				deleted: 0
			};
			mockedDB.mockGet.mockReturnValueOnce(mockNote);

			const result = NoteDatabaseService.GetNoteByID(1);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockNote);
		});

		it('should fail to retrieve a non-existent note', () => {
			mockedDB.mockGet.mockReturnValueOnce(null);

			const result = NoteDatabaseService.GetNoteByID(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note wasn't found");
		});
	});

	describe('UpdateNotesByID', () => {
		it('should successfully update a note', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const note = {
				id: 1,
				title: 'Updated Note',
				note: 'Updated note content',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.UpdateNotesByID(note);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Note updated');
		});

		it('should fail to update a non-existent note', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const note = {
				id: 999,
				title: 'Updated Note',
				note: 'Updated note content',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.UpdateNotesByID(note);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note couldn't be updated");
		});
	});

	describe('DeleteNoteByID', () => {
		it('should successfully delete a note', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const result = NoteDatabaseService.DeleteNoteByID(1);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Note deleted');
		});

		it('should fail to delete a non-existent note', () => {
			mockedDB.mockRun.mockReturnValueOnce({ changes: 0 });

			const result = NoteDatabaseService.DeleteNoteByID(999);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note couldn't be deleted");
		});
	});

	describe('GetCustomerNotes', () => {
		it('should successfully retrieve customer notes', () => {
			const mockNotes = [
				{
					id: 1,
					title: 'Customer Note 1',
					note: 'Test note content 1',
					createdDate: Date.now(),
					deleted: 0
				},
				{
					id: 2,
					title: 'Customer Note 2',
					note: 'Test note content 2',
					createdDate: Date.now(),
					deleted: 0
				}
			];
			mockedDB.mockAll.mockReturnValueOnce(mockNotes);

			const result = NoteDatabaseService.GetCustomerNotes(1);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockNotes);
		});

		it('should handle no customer notes found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = NoteDatabaseService.GetCustomerNotes(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Notes couldn't be found");
		});
	});

	describe('CreateAppointmentNote', () => {
		it('should successfully create an appointment note', () => {
			// Mock the CreateNote method to return success
			const createNoteMock = vi.spyOn(NoteDatabaseService as never, 'CreateNote').mockReturnValueOnce({
				success: true,
				data: 1
			});

			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const note: BaseNote = {
				title: 'Appointment Test Note',
				note: 'A test note for an appointment',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.CreateAppointmentNote(1, note);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Note created');

			createNoteMock.mockRestore();
		});

		it('should fail to create an appointment note', () => {
			const createNoteMock = vi.spyOn(NoteDatabaseService as never, 'CreateNote').mockReturnValueOnce({
				success: false,
				message: 'Note failed to create'
			});

			const note: BaseNote = {
				title: 'Appointment Test Note',
				note: 'A test note for an appointment',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.CreateAppointmentNote(1, note);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note couldn't be created");

			createNoteMock.mockRestore();
		});
	});

	describe('GetAppointmentNotes', () => {
		it('should successfully retrieve appointment notes', () => {
			const mockNotes = [
				{
					id: 1,
					title: 'Appointment Note 1',
					note: 'Test note content 1',
					createdDate: Date.now(),
					deleted: 0
				},
				{
					id: 2,
					title: 'Appointment Note 2',
					note: 'Test note content 2',
					createdDate: Date.now(),
					deleted: 0
				}
			];
			mockedDB.mockAll.mockReturnValueOnce(mockNotes);

			const result = NoteDatabaseService.GetAppointmentNotes(1);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockNotes);
		});

		it('should handle no appointment notes found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = NoteDatabaseService.GetAppointmentNotes(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note couldn't be created");
		});
	});

	describe('CreateServiceNote', () => {
		it('should successfully create a service note', () => {
			const createNoteMock = vi.spyOn(NoteDatabaseService as never, 'CreateNote').mockReturnValueOnce({
				success: true,
				data: 1
			});

			mockedDB.mockRun.mockReturnValueOnce({ changes: 1 });

			const note: BaseNote = {
				title: 'Service Test Note',
				note: 'A test note for a service',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.CreateServiceNote(1, note);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Note created');

			createNoteMock.mockRestore();
		});

		it('should fail to create a service note', () => {
			const createNoteMock = vi.spyOn(NoteDatabaseService as never, 'CreateNote').mockReturnValueOnce({
				success: false,
				message: 'Note failed to create'
			});

			const note: BaseNote = {
				title: 'Service Test Note',
				note: 'A test note for a service',
				createdDate: Date.now(),
				deleted: 0
			};

			const result = NoteDatabaseService.CreateServiceNote(1, note);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note couldn't be created");

			createNoteMock.mockRestore();
		});
	});

	describe('GetServiceNotes', () => {
		it('should successfully retrieve service notes', () => {
			const mockNotes = [
				{
					id: 1,
					title: 'Service Note 1',
					note: 'Test note content 1',
					createdDate: Date.now(),
					deleted: 0
				},
				{
					id: 2,
					title: 'Service Note 2',
					note: 'Test note content 2',
					createdDate: Date.now(),
					deleted: 0
				}
			];
			mockedDB.mockAll.mockReturnValueOnce(mockNotes);

			const result = NoteDatabaseService.GetServiceNotes(1);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockNotes);
		});

		it('should handle no service notes found', () => {
			mockedDB.mockAll.mockReturnValueOnce(null);

			const result = NoteDatabaseService.GetServiceNotes(1);

			expect(result.success).toBe(false);
			expect(result.message).toBe("Note couldn't be found");
		});
	});
});
