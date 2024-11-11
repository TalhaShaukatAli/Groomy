import type { CustomerRecord, BaseUserRecord, UserRecord } from './types';

let _page = $state('');

export const page = {
	get: () => _page,
	set: (newPage: string) => {
		_page = newPage;
	}
};

let _user = $state<UserRecord | undefined>();
export const authenticatedUser = {
	get: () => _user,
	set: (newUser: UserRecord) => {
		_user = newUser;
	}
};
