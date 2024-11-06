import { Appointment_GetAppointmentByID, Appointment_GetAppointmentsByUserID } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const id: string = await request.json();

		const result = await Appointment_GetAppointmentsByUserID(id)
        
		if (result != undefined) {
			return json({ success: true, message: "Success", data: result }, { status: 201 });
		} else {
			return json({ success: false, message: 'Error deleting appointment', data:undefined }, { status: 201 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error', data: undefined }, { status: 500 });
	}
};
