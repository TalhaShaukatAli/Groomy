import { Appointment_GetAppointmentByID, Customer_GetCustomerByID, Customer_GetCustomers } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { CustomerRecord } from '$lib/types';

export const load: PageServerLoad = async ({ params, url,locals }) => {
	let appointmentID = parseInt(params.slug);
	let editView = url.searchParams.get('edit') ? true : false;

	const appointments = Appointment_GetAppointmentByID(appointmentID);
	const customers = Customer_GetCustomers(locals.user?.id)

	if(customers == null){
		redirect(302,"/home/customers")
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
