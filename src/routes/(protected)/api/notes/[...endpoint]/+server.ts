import {
	Customer_AddNewCustomer,
	Customer_DeleteCustomerByID,
	Customer_GetCustomerByID,
	Customer_GetCustomers,
	Customer_UpdateCustomerByID,
	Notes_CreateAppointmentNote,
	Notes_CreateCustomerNote,
	Notes_DeleteNoteByID,
	Notes_GetAppointmentNotes,
	Notes_GetCustomerNotes,
	Notes_GetNoteByID,
	Notes_UpdateNotesByID
} from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'createCustomerNote': {
				const result = Notes_CreateCustomerNote(data[0], data[1]);
				if (result) {
					return json({ success: true }, { status: 201 });
				} else {
					return json({ success: false, message: "Couldn't create note" }, { status: 201 });
				}
			}

			case 'getCustomerNotes': {
				const result = Notes_GetCustomerNotes(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't get notes" });
				}
			}

			case 'createAppointmentNote': {
				const result = Notes_CreateAppointmentNote(data[0], data[1]);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: false, message: "Couldn't create notes" });
				}
			}

			case 'getAppointmentNotes': {
				const result = Notes_GetAppointmentNotes(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't get notes" });
				}
			}

			case 'updateNoteByID': {
				const result = Notes_UpdateNotesByID(data);
				if (result) {
					return json({ success: true, message: 'Success' });
				} else {
					return json({ success: false, message: "Couldn't update user" });
				}
			}

			case 'getNoteByID': {
				const result = Notes_GetNoteByID(data);
				if (result) {
					return json({ success: true, message: 'Success', data: result });
				} else {
					return json({ success: false, message: "Couldn't get user" });
				}
			}

			case "deleteNoteByID": {
				const result = Notes_DeleteNoteByID(data)
				if(result){
					return json({ success: true, message: 'Success'});
				} else {
					return json({ success: false, message: "Couldn't delete user" });
				}
			}

			default:
				return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
