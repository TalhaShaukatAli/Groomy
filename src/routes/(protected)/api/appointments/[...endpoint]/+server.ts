import {
	AppointmentDatabaseService
} from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = AppointmentDatabaseService.createAppointment(data);
				return json(result)

			}

			case 'delete': {
				const result = AppointmentDatabaseService.deleteAppointment(data);
				return json(result)

			}

			case 'update': {
				const result = AppointmentDatabaseService.updateAppointmentByID(data.id, data);
				return json(result)

			}

			case 'getByAppointmentID': {
				const id: number = data;
				const result = AppointmentDatabaseService.getAppointment(id);
				return json(result)

			}

			case 'getByCustomerID': {
				const id: number = data;
				const result = AppointmentDatabaseService.getAppointmentsByCustomerID(id);
				return json(result)
			}

			case 'getByUserID': {
				const id: number = data;
				const result = AppointmentDatabaseService.getAppointmentsByUserID(id);
				return json(result)
			}

			default:
				return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
