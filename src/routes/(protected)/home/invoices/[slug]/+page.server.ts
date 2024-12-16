import { CustomerDatabaseService, InvoiceDatabaseService } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const invoiceID = params.slug;
	const editView = url.searchParams.get('edit') ? true : false;

	const result = InvoiceDatabaseService.getInvoice(parseInt(invoiceID));
	const customerList = CustomerDatabaseService.getCustomers(locals.user.id);
	if (result.success) {
		return {
			invoiceInfo: JSON.stringify(result.data),
			customerInfo: JSON.stringify(customerList.data),
			editView: JSON.stringify(editView)
		};
	} else {
		redirect(302, '/home/invoices');
	}
};
