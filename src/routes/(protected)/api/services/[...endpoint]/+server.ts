import { ServiceDatabaseService } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = ServiceDatabaseService.createService(data);
				return json(result);
			}

			case 'delete': {
				const result = ServiceDatabaseService.deleteService(data);
				return json(result);
			}

			case 'update': {
				const result = ServiceDatabaseService.updateServiceByID(data.id, data);
				return json(result);
			}

			case 'getServicesByUserID': {
				const result = ServiceDatabaseService.getServicesByUserID(data);
				return json(result);
			}

			case 'getServiceByID': {
				const result = ServiceDatabaseService.getService(data);
				return json(result);
			}

			default:
				console.error(path, ' is an invalid path');
				return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
