import { describe, it, expect, beforeAll, beforeEach, vi, afterEach } from 'vitest';
import {
	Auth_AddNewUser,
	Auth_GetUserByEmail,
	Auth_AddCookie,
	Auth_RemoveCookie,
	Auth_GetCookie,
	Auth_UpdateCookie
} from '$lib/db/database';
import * as mongoModule from './mongo';
import type { cookie, existingUser, newUser } from '$lib/types';

// Mock the mongo module
vi.mock('./mongo', () => {
	// Create mock collection operations
	const mockInsertOne = vi.fn();
	const mockFindOne = vi.fn();
	const mockDeleteOne = vi.fn();
	const mockUpdateOne = vi.fn();

	// Create mock collection
	const mockCollection = {
		insertOne: mockInsertOne,
		findOne: mockFindOne,
		deleteOne: mockDeleteOne,
		updateOne: mockUpdateOne
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
			_id: 'someId',
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
