import API from '$lib/db/api';
import { AppointmentDatabaseService } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = AppointmentDatabaseService.getAppointmentsByUserID(locals.user.id);
	const returnResult = JSON.stringify(result.data);
	console.log(returnResult)
	return { appointment: returnResult };
};
