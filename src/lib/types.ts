export type existingUser = {
	_id: object;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type newUser = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type cookie = {
	cookie: string;
	expireTime: number;
};

export type newCustomerRecord = {
	userID: string,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	address: {
		street: string,
		city: string,
		state: string,
		zip: number
	}
	deleted: boolean
}

export type customerRecord = {
	_id: object
	userID: string,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	address: {
		street: string,
		city: string,
		state: string,
		zip: number
	}
	deleted: boolean
}
