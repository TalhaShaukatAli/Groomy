import { Customer_GetCustomerByID } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const customerID = params.slug;
	const editView = url.searchParams.get('edit') ? true : false;

	const result = Customer_GetCustomerByID(parseInt(customerID));
	if (result != null) {
		return {
			customerInfo: JSON.stringify(result),
			editView: JSON.stringify(editView)
		};
	} else {
		redirect(302, '/home/customers');
	}
};
