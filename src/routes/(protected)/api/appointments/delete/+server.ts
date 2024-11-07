import { Appointment_UpdateAppointmentByID } from '$lib/db/database';
import type { appointmentRecord, newAppointmentRecord } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const id: string = await request.json();
		const updateDoc = {
            $set: {
                deleted: true
            },
        }

		const result = await Appointment_UpdateAppointmentByID(id, updateDoc)
        
		if (result.acknowledged) {
			return json({ success: true }, { status: 201 });
		} else {
			return json({ success: false, message: 'Error deleting appointment' }, { status: 201 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
