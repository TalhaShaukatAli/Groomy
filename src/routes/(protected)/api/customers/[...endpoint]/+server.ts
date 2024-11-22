import { Customer_AddNewCustomer, Customer_DeleteCustomerByID, Customer_GetCustomerByID, Customer_GetCustomers, Customer_UpdateCustomerByID } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = Customer_AddNewCustomer(data);
				if (result) {
					return json({ success: true }, { status: 201 });
				} else {
					return json({ success: false, message: 'Error adding customer' }, { status: 201 });
				}
			}

			case 'delete': {
				const result = Customer_DeleteCustomerByID(data);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: false, message: "Couldn't delete user" });
				}
			}

			case 'update': {
				const result = Customer_UpdateCustomerByID(data.id, data);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: true, message: "Couldn't update user" });
				}
			}

			case 'getCustomersByUserID': {
				const result = Customer_GetCustomers(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't update user" });
				}
			}

			case 'getCustomerByUserID': {
				const result = Customer_GetCustomerByID(data);
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
