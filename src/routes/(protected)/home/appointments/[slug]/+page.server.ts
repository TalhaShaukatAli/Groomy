import { Appointment_GetAppointmentByID, Customer_GetCustomerByID, Customer_GetCustomers } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { CustomerRecord } from '$lib/types';

export const load: PageServerLoad = async ({ params, url,locals }) => {
	let appointmentID = params.slug;
	let editView = url.searchParams.get('edit') ? true : false;

	const appointments = await Appointment_GetAppointmentByID(appointmentID);
	const customers = await Customer_GetCustomers(locals.user?.id)

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
