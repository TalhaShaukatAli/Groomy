
let _page = $state('');

export const page = {
	get: () => _page,
	set: (newPage: string) => {
		_page = newPage;
	}
};
