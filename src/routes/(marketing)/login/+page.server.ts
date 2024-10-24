/** @type {import('./$types').Actions} */

import { AddCookie, AddNewUser, GetUserByEmail, RemoveCookie } from '$lib/db/database';
import { generateRandomString } from '@oslojs/crypto/random';
import argon2 from 'argon2';
import type { newUser } from '$lib/types';
import type { Actions } from './$types';

import type { RandomReader } from '@oslojs/crypto/random';
import { fail, redirect } from '@sveltejs/kit';

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = <string>data.get('email');
		const password = <string>data.get('password');

		let user = await GetUserByEmail(email);

		if (user == null) {
			return fail(422, {
				error: "Incorrect username or password"
			});
		} else {
			if (await argon2.verify(user.password, password)) {
				let cookieID = generateRandomString(random, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);
				await AddCookie(cookieID)
				cookies.set('sessionID', cookieID, { path: '/' });
				redirect(302, "/home")
			}
		}

	},
	create: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = <string>data.get('email');
		const password = <string>data.get('password');
		const passwordHash = await argon2.hash(password);
		const firstName = <string>data.get('firstName');
		const lastName = <string>data.get('lastName');

		

		let user = await GetUserByEmail(email);

		if (user !== null) {
			return fail(422, {
				error: "User with that email already exists"
			});
		}

		const newUserData: newUser = {
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			password: passwordHash
		};

		await AddNewUser(newUserData);
	},
} satisfies Actions;
