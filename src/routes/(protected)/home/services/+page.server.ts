import { ServiceDatabaseService } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = ServiceDatabaseService.getServicesByUserID(locals.user?.id);
	const returnResult = JSON.stringify(result.data);
	return { services: returnResult };
};
