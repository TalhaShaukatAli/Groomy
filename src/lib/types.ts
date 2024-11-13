type Address = {
	street: string;
	city: string;
	state: string;
	zip: number;
};

type RecordWithId<T> = { id: number } & T;

//User Records
export type BaseUserRecord = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type UserRecord = RecordWithId<BaseUserRecord>;

//Customer Records
export type BaseCustomerRecord = {
	userID: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: Address;
	deleted: number;
};

export type CustomerRecord = RecordWithId<BaseCustomerRecord>;

//Appointment Records
export type BaseAppointmentRecord = {
	time: {
		date: string;
		start: string;
		end: string;
		exact: number;
	};
	userID: number;
	customerID: number;
	title: string;
	description: string;
	address: Address;
	deleted: number;
};

export type AppointmentRecord = RecordWithId<BaseAppointmentRecord>;

//Cookie
export type cookie = {
	cookieID: string;
	userID: number;
	expireTime: number;
};
