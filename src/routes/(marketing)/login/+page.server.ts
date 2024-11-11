/** @type {import('./$types').Actions} */

import { Auth_AddCookie, Auth_AddNewUser, Auth_GetUserByEmail, Auth_RemoveCookie } from '$lib/db/database';
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
		const email = <string>data.get('email');
		const password = <string>data.get('password');

		const result = await API.login({ email, password });

		if (result.success) {
			const cookieID = generateRandomString(random, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);
			await Auth_AddCookie(cookieID, result.data._id.toString());
			cookies.set('sessionID', cookieID, { path: '/' });
			authenticatedUser.set(result.data);
			redirect(302, '/home');
		} else {
			return fail(422, {
				error: 'Incorrect username or password'
			});
		}
	},
	signup: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = <string>data.get('email');
		const password = <string>data.get('password');
		const passwordHash = await argon2.hash(password);
		const firstName = <string>data.get('firstName');
		const lastName = <string>data.get('lastName');

		const newUserData: BaseUserRecord = {
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			password: passwordHash
		};

		const result = await API.signup(newUserData);

		if (!result.success) {
			return fail(422, {
				error: result.message
			});
		}
	}
} satisfies Actions;
