import { CustomerDatabaseService } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = CustomerDatabaseService.createCustomer(data);
				return json(result);
			}

			case 'delete': {
				const result = CustomerDatabaseService.deleteCustomer(data);
				return json(result);
			}

			case 'update': {
				const result = CustomerDatabaseService.updateCustomer(data.id, data);
				return json(result);
			}

			case 'getCustomersByUserID': {
				const result = CustomerDatabaseService.getCustomers(data);
				return json(result);
			}

			case 'getCustomer': {
				const result = CustomerDatabaseService.getCustomer(data);
				return json(result);
			}

			default:
				console.error(path, ' is an invalid path');
				return json({ success: false, message: 'Invalid Endpoint' });
		}
	} catch (error) {
		console.error(error);
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
