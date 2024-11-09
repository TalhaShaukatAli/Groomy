import { Customer_AddNewCustomer } from '$lib/db/database';
import type { BaseCustomerRecord } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: BaseCustomerRecord = await request.json();
		const result = await Customer_AddNewCustomer(data);
		if (result) {
			return json({ success: true }, { status: 201 });
		} else {
			return json({ success: false, message: 'Error adding customer' }, { status: 201 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
