import { NoteDatabaseService } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			//Generics
			case 'getNoteByID': {
				const result = NoteDatabaseService.GetNoteByID(data);
				return json(result);
			}

			case 'updateNoteByID': {
				const result = NoteDatabaseService.UpdateNotesByID(data);
				return json(result);
			}

			case 'deleteNoteByID': {
				const result = NoteDatabaseService.DeleteNoteByID(data);
				return json(result);
			}

			//Customers
			case 'createCustomerNote': {
				const result = NoteDatabaseService.CreateCustomerNote(data[0], data[1]);
				return json(result);
			}

			case 'getCustomerNotes': {
				const result = NoteDatabaseService.GetCustomerNotes(data);
				return json(result);
			}

			//Appointment
			case 'createAppointmentNote': {
				const result = NoteDatabaseService.CreateAppointmentNote(data[0], data[1]);
				return json(result);
			}

			case 'getAppointmentNotes': {
				const result = NoteDatabaseService.GetAppointmentNotes(data);
				return json(result);
			}

			//Service
			case 'createServiceNote': {
				const result = NoteDatabaseService.CreateServiceNote(data[0], data[1]);
				return json(result);
			}

			case 'getServiceNotes': {
				const result = NoteDatabaseService.GetServiceNotes(data);
				return json(result);
			}

			//Invoice
			case 'createInvoiceNote': {
				const result = NoteDatabaseService.CreateInvoiceNote(data[0], data[1]);
				return json(result);
			}

			case 'getInvoiceNotes': {
				const result = NoteDatabaseService.GetInvoiceNotes(data);
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
