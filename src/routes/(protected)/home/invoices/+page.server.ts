import { AppointmentDatabaseService, CustomerDatabaseService, InvoiceDatabaseService } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const invoices = InvoiceDatabaseService.getInvoicesByUserID(locals.user?.id);
	const customers = CustomerDatabaseService.getCustomers(locals.user?.id);
	const appointments = AppointmentDatabaseService.getAppointmentsByUserID(locals.user?.id);

	const invoiceReturn = JSON.stringify(invoices.data);
	const customerReturn = JSON.stringify(customers.data);
	const appointmentReturn = JSON.stringify(appointments.data);

	return { invoices: invoiceReturn, customers: customerReturn, appointments: appointmentReturn };
};
