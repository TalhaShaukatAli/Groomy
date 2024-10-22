/** @type {import('./$types').Actions} */

import type { Actions } from './$types';

export const actions = {
	login: async ({ cookies, request}) => {
		// TODO log the user in
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
	},
	create: async ({ cookies, request }) => {
		// TODO register the user
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');

	}
} satisfies Actions;
