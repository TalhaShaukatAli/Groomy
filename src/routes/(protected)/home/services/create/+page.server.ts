import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userID = locals.user?.id;
	return {
		userID: userID
	};
};
