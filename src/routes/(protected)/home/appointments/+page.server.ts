import API from '$lib/db/api';
import { Appointment_GetAppointmentsByUserID } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
	const result = await Appointment_GetAppointmentsByUserID(locals.user.id)
	//const result = await Appointment_GetAppointmentsByUserID("user123")
	const returnResult = JSON.stringify(result)
	return {appointment:returnResult}
};