import API from '$lib/db/api';
import { Appointment_GetAppointmentsByUserID } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
	//const result = await Appointment_GetAppointmentsByUserID(locals.user.id)
	const returnResult = JSON.stringify([])
	return {appointment:returnResult}
};