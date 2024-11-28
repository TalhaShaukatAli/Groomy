import { AppointmentDatabaseService } from '$lib/db/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = AppointmentDatabaseService.getAppointmentsByUserID(locals.user.id);
	const returnResult = JSON.stringify(result.data);
	return { appointment: returnResult };
};
