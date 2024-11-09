import { Auth_GetUserByEmail, Customer_UpdateCustomerByID } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';
import argon2 from 'argon2';

import type { RandomReader } from '@oslojs/crypto/random';
import { authenticatedUser } from '$lib/stores.svelte';
import type { CustomerRecord } from '$lib/types';

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const id: string = await request.json();
		const updateDoc = {
			$set: {
				deleted: true
			}
		};

		const result = await Customer_UpdateCustomerByID(id, updateDoc);
		if (result) {
			return json({ success: true, message: 'Success' });
		} else {
			return json({ success: false, message: "Couldn't delete user" });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error. Try again later.' }, { status: 500 });
	}
};
