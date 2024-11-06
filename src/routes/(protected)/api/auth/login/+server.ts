import {Auth_GetUserByEmail } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';
import argon2 from 'argon2';

import type { RandomReader } from '@oslojs/crypto/random';
import { authenticatedUser } from '$lib/stores.svelte';

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};

export const POST: RequestHandler = async ({ request,cookies }) => {
	try {
		const data = await request.json();
		const user = await Auth_GetUserByEmail(data.email.toLowerCase());

		if (user == undefined) {
			return json({ success: false, message:"No user with this email", data: undefined }, { status: 500 });
		} else {
			if (await argon2.verify(user.password, data.password)) {
				return json({ success: true, message: "Success", data: user}, { status: 201 });
			} else {
				return json({ success: false , message: "Incorrect email or password",data: undefined}, { status: 500 });
			}
		}
	} catch (error) {
		return json({ success: false, message: "Server Error. Try again later.", data: undefined }, { status: 500 })
	}
};

