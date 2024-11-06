import type { customerRecord, userRecord } from './types';

let _page = $state('');

export const page = {
	get: () => _page,
	set: (page: string) => {
		_page = page;
	}
};

let _user: userRecord = $state();
export const authenticatedUser = {
	get: () => _user,
	set: (newUser: userRecord) => {
		_user = newUser;
	}
};
