import {
	Appointment_AddNewAppointment,
	Appointment_UpdateAppointmentByID,
	Appointment_GetAppointmentByID,
	Appointment_GetAppointmentsByUserID,
	Appointment_GetAppointmentsByCustomerID
} from '$lib/db/database';
import type { AppointmentRecord, BaseAppointmentRecord } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url }) => {
	try {
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
