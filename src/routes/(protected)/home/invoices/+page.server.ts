import { CustomerDatabaseService, InvoiceDatabaseService, ServiceDatabaseService } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const invoices = InvoiceDatabaseService.getInvoicesByUserID(locals.user?.id);
	const customers = CustomerDatabaseService.getCustomers(locals.user?.id);
	const services = ServiceDatabaseService.getServicesByUserID(locals.user.id)

	const invoiceReturn = JSON.stringify(invoices.data);
	const customerReturn = JSON.stringify(customers.data);
	const serviceReturn = JSON.stringify(services.data)

	return { invoices: invoiceReturn, customers: customerReturn, services: serviceReturn };
};
