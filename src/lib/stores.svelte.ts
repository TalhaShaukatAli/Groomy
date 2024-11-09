import type { CustomerRecord, BaseUserRecord } from './types';

let _page = $state('');

export const page = {
	get: () => _page,
	set: (newPage: string) => {
		_page = newPage;
	}
};

let _user = $state<BaseUserRecord | undefined>();
export const authenticatedUser = {
	get: () => _user,
	set: (newUser: BaseUserRecord) => {
		_user = newUser;
	}
};
