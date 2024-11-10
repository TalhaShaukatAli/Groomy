import { Customer_AddNewCustomer, Customer_GetCustomerByID, Customer_GetCustomers, Customer_UpdateCustomerByID } from '$lib/db/database';
import argon2 from 'argon2';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { CustomerRecord } from '$lib/types';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = await Customer_AddNewCustomer(data);
				if (result) {
					return json({ success: true }, { status: 201 });
				} else {
					return json({ success: false, message: 'Error adding customer' }, { status: 201 });
				}
			}

			case 'delete': {
				const updateDoc = {
					deleted: true
				};

				const result = await Customer_UpdateCustomerByID(data, updateDoc);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: false, message: "Couldn't delete user" });
				}
			}

			case 'update': {
				const { _id, deleted, ...newDoc } = data;

				const result = await Customer_UpdateCustomerByID(data._id.toString(), newDoc);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: true, message: "Couldn't update user" });
				}
			}

			case 'getCustomersByUserID': {
				const result = await Customer_GetCustomers(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't update user" });
				}
			}

			case 'getCustomerByUserID': {
				const result = await Customer_GetCustomerByID(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't find customer" });
				}
			}

			default:
				return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
