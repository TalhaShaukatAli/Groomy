import { Appointment_GetAppointmentByID } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { CustomerRecord } from '$lib/types';

export const load: PageServerLoad = async ({ params, url }) => {
	let appointmentID = params.slug;
	let editView = url.searchParams.get('edit') ? true : false;

	const result = await Appointment_GetAppointmentByID(appointmentID);
	if (result != null) {
		return {
			appointmentInfo: JSON.stringify(result),
			editView: JSON.stringify(editView)
		};
	} else {
		redirect(302, '/home/appointments');
	}
};
