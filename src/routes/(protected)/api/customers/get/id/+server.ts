import { Auth_GetUserByEmail, Customer_GetCustomerByID, Customer_GetCustomers, Customer_UpdateCustomerByID } from '$lib/db/database';
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

		const result = await Customer_GetCustomerByID(id);
		if (result) {
			return json({ success: true, message: 'Success', data: result });
		} else {
			return json({ success: false, message: "Couldn't find customer" });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error. Try again later.' }, { status: 500 });
	}
};
