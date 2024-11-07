import { Appointment_UpdateAppointmentByID } from '$lib/db/database';
import type { appointmentRecord, newAppointmentRecord } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: appointmentRecord = await request.json();
		const updateDoc = {
            $set: {
				time: {
					date: data.time.date,
					start: data.time.start,
					end: data.time.end,
					exact: data.time.exact,
				},
    			customerID: data.customerID,
    			title: data.title,
    			description: data.description,
    			address: {
        			street: data.address.street,
        			city: data.address.city,
					state: data.address.state,
        			zip: data.address.zip,
    			}
            },
        }

		const result = await Appointment_UpdateAppointmentByID(data._id.toString(), updateDoc)
		if (result.acknowledged) {
			return json({ success: true }, { status: 201 });
		} else {
			return json({ success: false, message: 'Error updating appointment' }, { status: 201 });
		}
	} catch (error) {
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};