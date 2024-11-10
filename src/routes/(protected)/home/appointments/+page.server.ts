import API from '$lib/db/api';
import { Appointment_GetAppointmentsByUserID } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await Appointment_GetAppointmentsByUserID(authenticatedUser.get()._id.toString())
	//const result = await Appointment_GetAppointmentsByUserID("user123")
	const returnResult = JSON.stringify(result)
	return {appointment:returnResult}
};