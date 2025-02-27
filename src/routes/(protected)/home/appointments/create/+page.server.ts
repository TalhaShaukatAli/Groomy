import { CustomerDatabaseService } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const customers = CustomerDatabaseService.getCustomers(locals.user?.id);
	if (customers === null || customers.data.length == 0) {
		redirect(302, '/home/customers');
	}
	return {
		customerInfo: JSON.stringify(customers.data),
		userID: locals.user.id
	};
};
