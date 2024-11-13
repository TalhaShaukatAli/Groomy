import { Appointment_GetAppointmentByID, Customer_GetCustomerByID, Customer_GetCustomers } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { CustomerRecord } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const customers = Customer_GetCustomers(locals.user?.id);

	if(customers == null){
		redirect(302,"/home/customers")
	}
	return {
		customerInfo: JSON.stringify(customers)
	};
};
