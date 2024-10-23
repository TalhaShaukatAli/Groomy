/** @type {import('./$types').Actions} */

import { AddNewUser, GetUserByEmail } from '$lib/db/database';
import { generateRandomString } from '@oslojs/crypto/random';
import argon2 from "argon2";
import type { newUser } from '$lib/types';
import type { Actions } from './$types';

import type { RandomReader } from '@oslojs/crypto/random';

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};


export const actions = {
	login: async ({ cookies, request}) => {
        const data = await request.formData();
		const email = data.get('email');
		const password = <string>data.get('password');

        let user = await GetUserByEmail(email)

		if (user == null){
			return undefined
		} else {
			if (await argon2.verify(user.password, password)) {
				console.log(password);
			}
		}

		

		let cookieID = generateRandomString(random, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);
		cookies.set('sessionID', cookieID, { path: '/' });
	},
	create: async ({ cookies, request }) => {
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const passwordHash = await argon2.hash(password);
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');

		console.log(passwordHash)

        const newUserData:newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash
        }

        await AddNewUser(newUserData)

	}
} satisfies Actions;
