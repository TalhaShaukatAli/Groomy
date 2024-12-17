import { CustomerDatabaseService, ServiceDatabaseService } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const editView = url.searchParams.get('edit') ? true : false;

	const customerList = CustomerDatabaseService.getCustomers(locals.user.id);
	const servicesList = ServiceDatabaseService.getServicesByUserID(locals.user.id)
	if (customerList.success) {
		return {
			customerInfo: JSON.stringify(customerList.data),
			servicesInfo: JSON.stringify(servicesList.data),
			editView: JSON.stringify(editView),
			userID: locals.user.id

		};
	} else {
		redirect(302, '/home/invoices');
	}
};
