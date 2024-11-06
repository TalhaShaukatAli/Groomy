import { Customer_GetCustomers } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import type { customerRecord } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await Customer_GetCustomers(authenticatedUser.get()._id.toString())
	const returnResult = JSON.stringify(result)
	return {customers:returnResult}
};