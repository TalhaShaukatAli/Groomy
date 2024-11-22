import { Service_GetServicesByUserID } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = Service_GetServicesByUserID(locals.user?.id);
	const returnResult = JSON.stringify(result);
	return { services: returnResult };
};
