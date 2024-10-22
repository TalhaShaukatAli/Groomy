/** @type {import('./$types').Actions} */

import { AddNewUser, GetUserByEmail } from '$lib/db/database';
import type { newUser } from '$lib/types';
import type { Actions } from './$types';

export const actions = {
	login: async ({ cookies, request}) => {
		// TODO log the user in
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

        let user = await GetUserByEmail(email)
        if (user == null){

		} else {
			
		}

	},
	create: async ({ cookies, request }) => {
		// TODO register the user
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');

        const newUserData:newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        await AddNewUser(newUserData)

	}
} satisfies Actions;
