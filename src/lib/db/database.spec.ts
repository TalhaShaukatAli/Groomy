import { describe, it, expect, beforeAll, beforeEach, vi, afterEach } from 'vitest';
import {
	Auth_AddNewUser,
	Auth_GetUserByEmail,
	Auth_AddCookie,
	Auth_RemoveCookie,
	Auth_GetCookie,
	Auth_UpdateCookie,
	Customer_UpdateCustomerByID,
	Customer_AddNewCustomer,
	Customer_GetCustomerByID,
	Customer_GetCustomers,
	Appointment_UpdateAppointmentByID,
	Appointment_GetAppointmentsByUserID,
	Appointment_AddNewAppointment,
	Appointment_GetAppointmentByID,
	Appointment_GetAppointmentsByCustomerID
} from '$lib/db/database';
import * as mongoModule from './mongo';
import type { cookie, CustomerRecord, BaseCustomerRecord, BaseUserRecord, AppointmentRecord, BaseAppointmentRecord, UserRecord } from '$lib/types';
import { ObjectId } from 'mongodb';

// Mock the mongo module
vi.mock('./mongo', () => {
	// Create mock collection
	const mockCollection = {
		insertOne: vi.fn(),
		findOne: vi.fn(),
		deleteOne: vi.fn(),
		updateOne: vi.fn()
	};

	// Create mock db
	const mockDb = {
		collection: vi.fn().mockReturnValue(mockCollection)
	};

	return {
		getDB: vi.fn().mockReturnValue(mockDb)
	};
});

describe('Database Functions', () => {
	const db = mongoModule.getDB();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('User Functions', () => {
		const mockNewUser: BaseUserRecord = {
			email: 'test@example.com',
			password: 'hashedPassword',
			firstName: 'testUser',
			lastName: 'fefs'
		};

		const mockExistingUser: UserRecord = {
			_id: new ObjectId('507f1f77bcf86cd799439011'),
			...mockNewUser
		};

		describe('AddNewUser', () => {
			it('should add a new user successfully', async () => {
				const mockInsertOne = vi.fn().mockResolvedValue({ acknowledged: true });
				db.collection('users').insertOne = mockInsertOne;

				await Auth_AddNewUser(mockNewUser);

				expect(db.collection).toHaveBeenCalledWith('users');
				expect(mockInsertOne).toHaveBeenCalledWith(mockNewUser);
			});

			it('should throw error if insertion fails', async () => {
				const mockInsertOne = vi.fn().mockRejectedValue(new Error('DB Error'));
				db.collection('users').insertOne = mockInsertOne;

				await expect(Auth_AddNewUser(mockNewUser)).rejects.toThrow('DB Error');
			});
		});

		describe('GetUserByEmail', () => {
			it('should return user when found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(mockExistingUser);
				db.collection('users').findOne = mockFindOne;

				const result = await Auth_GetUserByEmail('test@example.com');

				expect(db.collection).toHaveBeenCalledWith('users');
				expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
				expect(result).toEqual(mockExistingUser);
			});

			it('should return undefined when user not found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(null);
				db.collection('users').findOne = mockFindOne;

				const result = await Auth_GetUserByEmail('nonexistent@example.com');

				expect(result).toBeNull();
			});
		});
	});

	describe('Customer Functions', () => {
		const mockCustomer: BaseCustomerRecord = {
			userID: 'testUserId',
			firstName: 'Test',
			lastName: 'customer',
			email: 'customer@example.com',
			phone: '1234567890',
			address: {
				street: '123 Test St',
				city: 'Test City',
				state: 'MN',
				zip: 49596
			},
			deleted: false
		};

		const mockExistingCustomer: CustomerRecord = {
			_id: new ObjectId('507f1f77bcf86cd799439011'),
			...mockCustomer
		};

		describe('AddNewCustomer', () => {
			it('should add a new customer successfully', async () => {
				const mockInsertOne = vi.fn().mockResolvedValue({ acknowledged: true });
				db.collection('customer').insertOne = mockInsertOne;

				await Customer_AddNewCustomer(mockCustomer);

				expect(db.collection).toHaveBeenCalledWith('customer');
				expect(mockInsertOne).toHaveBeenCalledWith(mockCustomer);
			});

			it('should throw error if insertion fails', async () => {
				const mockInsertOne = vi.fn().mockRejectedValue(new Error('DB Error'));
				db.collection('customer').insertOne = mockInsertOne;

				await expect(Customer_AddNewCustomer(mockCustomer)).rejects.toThrow('DB Error');
			});
		});

		describe('GetCustomers', () => {
			it('should return customers array when found', async () => {
				const mockCustomers = [mockExistingCustomer];
				const mockFind = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue(mockCustomers)
				});
				db.collection('customer').find = mockFind;

				const result = await Customer_GetCustomers('testUserId');

				expect(db.collection).toHaveBeenCalledWith('customer');
				expect(mockFind).toHaveBeenCalledWith({ userID: 'testUserId', deleted: false });
				expect(result).toEqual(mockCustomers);
			});

			it('should return undefined when no customers found', async () => {
				const mockFind = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue(null)
				});
				db.collection('customer').find = mockFind;

				const result = await Customer_GetCustomers('nonexistentUserId');

				expect(result).toBeNull();
			});
		});

		describe('GetCustomerByID', () => {
			it('should return customer when found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(mockExistingCustomer);
				db.collection('customer').findOne = mockFindOne;

				const result = await Customer_GetCustomerByID('507f1f77bcf86cd799439011');

				expect(db.collection).toHaveBeenCalledWith('customer');
				expect(mockFindOne).toHaveBeenCalledWith({
					_id: new ObjectId('507f1f77bcf86cd799439011')
				});
				expect(result).toEqual(mockExistingCustomer);
			});

			it('should return undefined when customer not found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(null);
				db.collection('customer').findOne = mockFindOne;

				const result = await Customer_GetCustomerByID('507f1f77bcf86cd799439011');

				expect(result).toBeNull();
			});

			it('should handle invalid ObjectId', async () => {
				const mockFindOne = vi.fn();
				db.collection('customer').findOne = mockFindOne;

				await expect(Customer_GetCustomerByID('invalid-id')).rejects.toThrow();
			});
		});

		describe('UpdateCustomerByID', () => {
			it('should update customer successfully', async () => {
				const mockUpdateOne = vi.fn().mockResolvedValue({ acknowledged: true });
				db.collection('customer').updateOne = mockUpdateOne;

				const updatedCustomer = { ...mockExistingCustomer, name: 'Updated Name' };
				const result = await Customer_UpdateCustomerByID('507f1f77bcf86cd799439011', updatedCustomer);

				expect(db.collection).toHaveBeenCalledWith('customer');
				expect(mockUpdateOne).toHaveBeenCalledWith({ _id: new ObjectId('507f1f77bcf86cd799439011') }, updatedCustomer);
				expect(result).toBe(true);
			});

			it('should return false when update fails', async () => {
				const mockUpdateOne = vi.fn().mockResolvedValue({ acknowledged: false });
				db.collection('customer').updateOne = mockUpdateOne;

				const result = await Customer_UpdateCustomerByID('507f1f77bcf86cd799439011', mockExistingCustomer);

				expect(result).toBe(false);
			});

			it('should handle invalid ObjectId', async () => {
				const mockUpdateOne = vi.fn();
				db.collection('customer').updateOne = mockUpdateOne;

				await expect(Customer_UpdateCustomerByID('invalid-id', mockExistingCustomer)).rejects.toThrow();
			});
		});
	});

	describe('Cookie Functions', () => {
		const mockTime = 1000;
		const mockExpireTime = mockTime + 3600 * 1000;

		beforeEach(() => {
			vi.setSystemTime(mockTime);
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		describe('AddCookie', () => {
			it('should add a cookie successfully', async () => {
				const mockInsertOne = vi.fn().mockResolvedValue(true);
				db.collection('cookie').insertOne = mockInsertOne;

				const cookieString = 'test-cookie';
				await Auth_AddCookie(cookieString);

				expect(db.collection).toHaveBeenCalledWith('cookie');
				expect(mockInsertOne).toHaveBeenCalledWith({
					cookie: cookieString,
					expireTime: mockExpireTime
				});
			});
		});

		describe('RemoveCookie', () => {
			it('should remove a cookie successfully', async () => {
				const mockDeleteOne = vi.fn().mockResolvedValue(true);
				db.collection('cookie').deleteOne = mockDeleteOne;

				const cookieString = 'test-cookie';
				await Auth_RemoveCookie(cookieString);

				expect(db.collection).toHaveBeenCalledWith('cookie');
				expect(mockDeleteOne).toHaveBeenCalledWith({ cookie: cookieString });
			});
		});

		describe('GetCookie', () => {
			const mockCookie: cookie = {
				cookie: 'test-cookie',
				expireTime: mockExpireTime
			};

			it('should return cookie when found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(mockCookie);
				db.collection('cookie').findOne = mockFindOne;

				const result = await Auth_GetCookie('test-cookie');

				expect(db.collection).toHaveBeenCalledWith('cookie');
				expect(mockFindOne).toHaveBeenCalledWith({ cookie: 'test-cookie' });
				expect(result).toEqual(mockCookie);
			});

			it('should return null when cookie not found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(null);
				db.collection('cookie').findOne = mockFindOne;

				const result = await Auth_GetCookie('nonexistent-cookie');

				expect(result).toBeNull();
			});
		});

		describe('UpdateCookie', () => {
			it('should update cookie expiration time', async () => {
				const mockUpdateOne = vi.fn().mockResolvedValue(true);
				db.collection('cookie').updateOne = mockUpdateOne;

				const cookieString = 'test-cookie';
				await Auth_UpdateCookie(cookieString);

				expect(db.collection).toHaveBeenCalledWith('cookie');
				expect(mockUpdateOne).toHaveBeenCalledWith({ cookie: cookieString }, { $set: { expireTime: mockExpireTime } });
			});
		});
	});

	describe('Appointment Functions', () => {
		const db = mongoModule.getDB();

		beforeEach(() => {
			vi.clearAllMocks();
		});

		const mockAppointment: BaseAppointmentRecord = {
			userID: 'testUserId',
			customerID: 'testCustomerId',
			title: 'Test Appointment',
			description: 'Regular maintenance check',
			time: {
				date: '2024-01-01',
				start: '10:00',
				end: '11:00',
				exact: 1704096000000 // Unix timestamp for 2024-01-01 10:00:00
			},
			address: {
				street: '123 Test St',
				city: 'Test City',
				state: 'MN',
				zip: 55123
			},
			deleted: false
		};

		const mockExistingAppointment: AppointmentRecord = {
			_id: new ObjectId('507f1f77bcf86cd799439011'),
			...mockAppointment
		};

		describe('AddNewAppointment', () => {
			it('should add a new appointment successfully', async () => {
				const mockInsertOne = vi.fn().mockResolvedValue(true);
				db.collection('appointments').insertOne = mockInsertOne;

				await Appointment_AddNewAppointment(mockAppointment);

				expect(db.collection).toHaveBeenCalledWith('appointments');
				expect(mockInsertOne).toHaveBeenCalledWith(mockAppointment);
			});

			it('should throw error if insertion fails', async () => {
				const mockInsertOne = vi.fn().mockRejectedValue(new Error('DB Error'));
				db.collection('appointments').insertOne = mockInsertOne;

				await expect(Appointment_AddNewAppointment(mockAppointment)).rejects.toThrow('DB Error');
			});
		});

		describe('GetAppointmentByID', () => {
			it('should return appointment when found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(mockExistingAppointment);
				db.collection('appointments').findOne = mockFindOne;

				const result = await Appointment_GetAppointmentByID('507f1f77bcf86cd799439011');

				expect(db.collection).toHaveBeenCalledWith('appointments');
				expect(mockFindOne).toHaveBeenCalledWith({
					_id: new ObjectId('507f1f77bcf86cd799439011')
				});
				expect(result).toEqual(mockExistingAppointment);
			});

			it('should return undefined when appointment not found', async () => {
				const mockFindOne = vi.fn().mockResolvedValue(null);
				db.collection('appointments').findOne = mockFindOne;

				const result = await Appointment_GetAppointmentByID('507f1f77bcf86cd799439011');

				expect(result).toBeNull();
			});

			it('should handle invalid ObjectId', async () => {
				const mockFindOne = vi.fn();
				db.collection('appointments').findOne = mockFindOne;

				await expect(Appointment_GetAppointmentByID('invalid-id')).rejects.toThrow();
			});
		});

		describe('GetAppointmentsByCustomerID', () => {
			it('should return appointments array when found', async () => {
				const mockAppointments = [mockExistingAppointment];
				const mockFind = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue(mockAppointments)
				});
				db.collection('appointments').find = mockFind;

				const result = await Appointment_GetAppointmentsByCustomerID('testCustomerId');

				expect(db.collection).toHaveBeenCalledWith('appointments');
				expect(mockFind).toHaveBeenCalledWith({ customerID: 'testCustomerId', deleted: false });
				expect(result).toEqual(mockAppointments);
			});

			it('should return undefined when no appointments found', async () => {
				const mockFind = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue(null)
				});
				db.collection('appointments').find = mockFind;

				const result = await Appointment_GetAppointmentsByCustomerID('nonexistentCustomerId');

				expect(result).toBeNull();
			});

			it('should only return non-deleted appointments', async () => {
				const mockFind = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue([])
				});
				db.collection('appointments').find = mockFind;

				await Appointment_GetAppointmentsByCustomerID('testCustomerId');

				expect(mockFind).toHaveBeenCalledWith(expect.objectContaining({ deleted: false }));
			});
		});

		describe('GetAppointmentsByUserID', () => {
			it('should return sorted appointments array when found', async () => {
				const mockAppointments = [mockExistingAppointment];
				const mockSort = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue(mockAppointments)
				});
				const mockFind = vi.fn().mockReturnValue({
					sort: mockSort
				});
				db.collection('appointments').find = mockFind;

				const result = await Appointment_GetAppointmentsByUserID('testUserId');

				expect(db.collection).toHaveBeenCalledWith('appointments');
				expect(mockFind).toHaveBeenCalledWith({ userID: 'testUserId', deleted: false });
				expect(mockSort).toHaveBeenCalledWith({ 'time.exact': 1 });
				expect(result).toEqual(mockAppointments);
			});

			it('should return undefined when no appointments found', async () => {
				const mockSort = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue(null)
				});
				const mockFind = vi.fn().mockReturnValue({
					sort: mockSort
				});
				db.collection('appointments').find = mockFind;

				const result = await Appointment_GetAppointmentsByUserID('nonexistentUserId');

				expect(result).toBeNull();
			});

			it('should sort appointments by time.exact in ascending order', async () => {
				const mockSort = vi.fn().mockReturnValue({
					toArray: vi.fn().mockResolvedValue([])
				});
				const mockFind = vi.fn().mockReturnValue({
					sort: mockSort
				});
				db.collection('appointments').find = mockFind;

				await Appointment_GetAppointmentsByUserID('testUserId');

				expect(mockSort).toHaveBeenCalledWith({ 'time.exact': 1 });
			});
		});

		describe('UpdateAppointmentByID', () => {
			it('should update appointment successfully', async () => {
				const mockUpdateOne = vi.fn().mockResolvedValue({ acknowledged: true });
				db.collection('appointments').updateOne = mockUpdateOne;

				const updatedAppointment = {
					...mockAppointment,
					title: 'Updated Title',
					description: 'Updated description'
				};

				const result = await Appointment_UpdateAppointmentByID('507f1f77bcf86cd799439011', updatedAppointment);

				expect(db.collection).toHaveBeenCalledWith('appointments');
				expect(mockUpdateOne).toHaveBeenCalledWith({ _id: new ObjectId('507f1f77bcf86cd799439011') }, { $set: updatedAppointment });
				expect(result).toBe(true);
			});

			it('should return false when update fails', async () => {
				const mockUpdateOne = vi.fn().mockResolvedValue({ acknowledged: false });
				db.collection('appointments').updateOne = mockUpdateOne;

				const result = await Appointment_UpdateAppointmentByID('507f1f77bcf86cd799439011', mockAppointment);

				expect(result).toBe(false);
			});

			it('should handle invalid ObjectId', async () => {
				const mockUpdateOne = vi.fn();
				db.collection('appointments').updateOne = mockUpdateOne;

				await expect(Appointment_UpdateAppointmentByID('invalid-id', mockAppointment)).rejects.toThrow();
			});
		});
	});
});
