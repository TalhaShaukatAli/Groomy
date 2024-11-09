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
		const data: CustomerRecord = await request.json();
		console.log(data);
		const updateDoc = {
			$set: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				address: {
					street: data.address.street,
					city: data.address.city,
					state: data.address.city,
					zip: data.address.zip
				},
				deleted: false
			}
		};

		const result = await Customer_UpdateCustomerByID(data._id.toString(), updateDoc);
		if (result) {
			return json({ success: true, message: 'Success' });
		} else {
			return json({ success: true, message: "Couldn't update user" });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error. Try again later.' }, { status: 500 });
	}
};
