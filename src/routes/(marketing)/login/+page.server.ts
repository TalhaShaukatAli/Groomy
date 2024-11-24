/** @type {import('./$types').Actions} */

import { AuthDatabaseService } from '$lib/db/database';
import { generateRandomString } from '@oslojs/crypto/random';
import { authenticatedUser } from '$lib/stores.svelte';
import argon2 from 'argon2';
import type { BaseUserRecord } from '$lib/types';
import type { Actions } from './$types';

import type { RandomReader } from '@oslojs/crypto/random';
import { fail, redirect } from '@sveltejs/kit';
import API from '$lib/db/api';

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = (<string>data.get('email')).toLowerCase();
		const password = <string>data.get('password');

		const user = AuthDatabaseService.getUserByEmail(email);

		if (user.success) {
			if (await argon2.verify(user.data.hashedPassword, password)) {
				const cookieID = generateRandomString(random, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);
				AuthDatabaseService.createCookie(cookieID, user.data.id);
				cookies.set('sessionID', cookieID, { path: '/' });
				authenticatedUser.set(user.data);
				redirect(302, '/home');
			}
		}

		return fail(422, {
			error: 'Incorrect username or password'
		});
	},
	signup: async ({ request }) => {
		const data = await request.formData();
		const email = <string>data.get('email');
		const password = <string>data.get('password');
		const passwordHash = await argon2.hash(password, { timeCost: 2 });
		const firstName = <string>data.get('firstName');
		const lastName = <string>data.get('lastName');

		const newUserData: BaseUserRecord = {
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			hashedPassword: passwordHash
		};

		const result = AuthDatabaseService.createUser(newUserData);

		if (!result.success) {
			return fail(422, {
				error: result.message
			});
		}
	}
} satisfies Actions;
