import { CustomerDatabaseService } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = CustomerDatabaseService.getCustomers(locals.user?.id);
	const returnResult = JSON.stringify(result.data);
	return { customers: returnResult };
};
