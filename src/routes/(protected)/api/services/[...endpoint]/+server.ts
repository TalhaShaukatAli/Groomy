import {
	Notes_CreateAppointmentNote,
	Notes_CreateCustomerNote,
	Notes_DeleteNoteByID,
	Notes_GetAppointmentNotes,
	Notes_GetCustomerNotes,
	Notes_GetNoteByID,
	Notes_UpdateNotesByID,
    Service_AddNewService,
    Service_DeleteByID,
    Service_GetServicesByID,
    Service_GetServicesByUserID,
    Service_UpdateByID
} from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = Service_AddNewService(data);
				if (result) {
					return json({ success: true }, { status: 201 });
				} else {
					return json({ success: false, message: 'Error adding service' }, { status: 201 });
				}
			}

			case 'delete': {
				const result = Service_DeleteByID(data);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: false, message: "Couldn't delete service" });
				}
			}

			case 'update': {
				const result = Service_UpdateByID(data.id, data);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: true, message: "Couldn't update service" });
				}
			}

			case 'getServicesByUserID': {
				const result = Service_GetServicesByUserID(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't update user" });
				}
			}

			case 'getServiceByID': {
				const result = Service_GetServicesByID(data);
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
