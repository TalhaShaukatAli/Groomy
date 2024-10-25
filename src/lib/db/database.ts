import type { cookie, existingUser, newUser } from '$lib/types';
import { getDB } from './mongo';

// Create a class to handle database operations
export class DatabaseService {
	private db;

	constructor(db = getDB()) {
		this.db = db;
	}

	async addNewUser(user: newUser) {
		let result = await this.db.collection('users').insertOne(user);
		return result
	}

	async getUserByEmail(email: string): Promise<existingUser | undefined> {
		const returnData = await this.db.collection('users').findOne({ email: email });
		if (returnData != null) {
			return <existingUser>returnData;
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
		const result = <cookie>(<unknown>await this.db.collection('cookie').findOne({ cookie: cookie }));
		return result;
	}

	async updateCookie(cookie: string) {
		const updateDoc = { $set: { expireTime: Date.now() + 3600 * 1000 } };
		await this.db.collection('cookie').updateOne({ cookie: cookie }, updateDoc);
	}
}

const defaultDbService = new DatabaseService();

export const AddNewUser = (user: newUser) => defaultDbService.addNewUser(user);
export const GetUserByEmail = (email: string) => defaultDbService.getUserByEmail(email);
export const AddCookie = (cookie: string) => defaultDbService.addCookie(cookie);
export const RemoveCookie = (cookie: string) => defaultDbService.removeCookie(cookie);
export const GetCookie = (cookie: string) => defaultDbService.getCookie(cookie);
export const UpdateCookie = (cookie: string) => defaultDbService.updateCookie(cookie);
