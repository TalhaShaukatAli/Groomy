import API from '$lib/db/api';
import { Appointment_AddNewAppointment } from '$lib/db/database';
import type { newAppointmentRecord } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: newAppointmentRecord = await request.json();
		const result = await Appointment_AddNewAppointment(data)
		if (result.acknowledged) {
			return json({ success: true }, { status: 201 });
		} else {
			return json({ success: false, message: 'Error adding appointment' }, { status: 201 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
