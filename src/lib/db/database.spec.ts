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
	Customer_GetCustomers
} from '$lib/db/database';
import * as mongoModule from './mongo';
import type { cookie, customerRecord, existingUser, newCustomerRecord, newUser } from '$lib/types';
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
		const mockNewUser: newUser = {
			email: 'test@example.com',
			password: 'hashedPassword',
			firstName: 'testUser',
			lastName: 'fefs'
		};

		const mockExistingUser: existingUser = {
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

				expect(result).toBeUndefined();
			});
		});
	});

	describe('Customer Functions', () => {
		const mockCustomer: newCustomerRecord = {
			userID: 'testUserId',
			firstName: 'Test',
			lastName: "customer",
			email: 'customer@example.com',
			phone: '1234567890',
			address: {
				street: '123 Test St',
				city: "Test City",
				state: "MN",
				zip: 49596
			},
			deleted: false
		};
	
		const mockExistingCustomer: customerRecord = {
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
	
				expect(result).toBeUndefined();
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
				expect(mockUpdateOne).toHaveBeenCalledWith(
					{ _id: new ObjectId('507f1f77bcf86cd799439011') },
					updatedCustomer
				);
				expect(result.acknowledged).toBe(true);
			});
	
			it('should return false when update fails', async () => {
				const mockUpdateOne = vi.fn().mockResolvedValue({ acknowledged: false });
				db.collection('customer').updateOne = mockUpdateOne;
	
				const result = await Customer_UpdateCustomerByID(
					'507f1f77bcf86cd799439011',
					mockExistingCustomer
				);
	
				expect(result.acknowledged).toBe(false);
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
				const mockInsertOne = vi.fn().mockResolvedValue({ acknowledged: true });
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
				const mockDeleteOne = vi.fn().mockResolvedValue({ deletedCount: 1 });
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
				const mockUpdateOne = vi.fn().mockResolvedValue({ modifiedCount: 1 });
				db.collection('cookie').updateOne = mockUpdateOne;

				const cookieString = 'test-cookie';
				await Auth_UpdateCookie(cookieString);

				expect(db.collection).toHaveBeenCalledWith('cookie');
				expect(mockUpdateOne).toHaveBeenCalledWith(
					{ cookie: cookieString },
					{ $set: { expireTime: mockExpireTime } }
				);
			});
		});
	});
});
