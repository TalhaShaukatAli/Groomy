import { Auth_AddNewUser, Auth_GetUserByEmail } from '$lib/db/database';
import argon2 from 'argon2';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'signup': {
				const user = Auth_GetUserByEmail(data.email);

				if (user != null) {
					return json({ success: false, message: 'User with email already exists' }, { status: 201 });
				}
				let result = Auth_AddNewUser(data);

				if (result) {
					return json({ success: true, message: 'Success' }, { status: 201 });
				} else {
					return json({ success: false, message: 'Error creating account. Try again later.' }, { status: 201 });
				}
			}

			case 'login': {
				const user = Auth_GetUserByEmail(data.email.toLowerCase());

				if (user == null) {
					return json({ success: false, message: 'No user with this email', data: undefined }, { status: 500 });
				} else {
					if (await argon2.verify(user.hashedPassword, data.password)) {
						return json({ success: true, message: 'Success', data: user }, { status: 201 });
					} else {
						return json({ success: false, message: 'Incorrect email or password', data: undefined }, { status: 500 });
					}
				}
			}
			default:
				return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });

		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
