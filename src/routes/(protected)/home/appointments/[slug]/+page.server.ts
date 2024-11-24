import { Appointment_GetAppointmentByID, AuthDatabaseService, CustomerDatabaseService } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const appointmentID = parseInt(params.slug);
	const editView = url.searchParams.get('edit') ? true : false;

	const appointments = Appointment_GetAppointmentByID(appointmentID);
	const customers = CustomerDatabaseService.getCustomers(locals.user?.id);

	if (customers == null) {
		redirect(302, '/home/customers');
	}

	if (appointments != null) {
		return {
			appointmentInfo: JSON.stringify(appointments),
			customerInfo: JSON.stringify(customers),
			editView: JSON.stringify(editView)
		};
	} else {
		redirect(302, '/home/appointments');
	}
};
