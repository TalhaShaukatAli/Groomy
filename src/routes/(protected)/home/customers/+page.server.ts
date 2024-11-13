import { Customer_GetCustomers } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import type { CustomerRecord } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
	const result = Customer_GetCustomers(locals.user?.id);
	const returnResult = JSON.stringify(result);
	return { customers: returnResult };
};
