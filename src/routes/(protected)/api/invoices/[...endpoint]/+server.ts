import { InvoiceDatabaseService } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'create': {
				const result = InvoiceDatabaseService.createInvoice(data);
				return json(result);
			}

			case 'delete': {
				const result = InvoiceDatabaseService.deleteInvoice(data);
				return json(result);
			}

			case 'update': {
				const result = InvoiceDatabaseService.updateInvoiceByID(data.id, data);
				return json(result);
			}

			case 'getInvoicesByUserID': {
				const result = InvoiceDatabaseService.getInvoicesByUserID(data);
				return json(result);
			}

			case 'getInvoiceByID': {
				const result = InvoiceDatabaseService.getInvoice(data);
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
