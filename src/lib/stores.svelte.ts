import type { customerRecord, existingUser } from "./types";

let _page = $state('');

export const page = {
	get: () => _page,
	set: (page: string) => {
		_page = page;
	}
};

let _user:existingUser = $state()
export const authenticatedUser = {
	get: () => _user,
	set: (newUser: existingUser) => {
		_user = newUser
	}
}
