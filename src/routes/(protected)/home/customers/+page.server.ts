import { Customer_GetCustomers } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = Customer_GetCustomers(locals.user?.id);
	const returnResult = JSON.stringify(result);
	return { customers: returnResult };
};
