import { Customer_GetCustomers } from '$lib/db/database';
import type { customerRecord } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await Customer_GetCustomers("67183fb5525595c4319c0667")
	const returnResult = JSON.stringify(result)
	return {customers:returnResult}
};