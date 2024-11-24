export type DatabaseResponse = {
	success: boolean;
	message: string;
};

export type DatabaseDataResponse<T> =
	| {
			success: true;
			message: string;
			/**
			 *  The returned data
			 * @remarks
			 * This field is only available when success is true.
			 * You must check the success field before accessing data.
			 */
			data: T;
	  }
	| {
			success: false;
			message: string;
			data?: undefined;
	  };

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
	hashedPassword: string;
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
	id: string;
	userID: number;
	expireTime: number;
};

export type BaseNote = {
	title: string;
	note: string;
	createdDate: number;
	deleted: number;
};

export type Note = RecordWithId<BaseNote>;

export type BaseServiceRecord = {
	userID: number,
	name: string,
	description: string,
	price: number,
	deleted: 0 | 1
}

export type ServiceRecord = RecordWithId<BaseServiceRecord>