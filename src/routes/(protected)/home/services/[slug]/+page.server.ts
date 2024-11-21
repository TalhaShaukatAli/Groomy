import { Service_GetServicesByID } from '$lib/db/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const serviceID = params.slug;
	const editView = url.searchParams.get('edit') ? true : false;

	const result = Service_GetServicesByID(parseInt(serviceID));
	if (result != null) {
		return {
			serviceInfo: JSON.stringify(result),
			editView: JSON.stringify(editView)
		};
	} else {
		redirect(302, '/home/service');
	}
};
