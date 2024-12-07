/** 
 * Represents a basic database operation response 
 * @description Indicates the success status and provides a message about the operation
 */
export type DatabaseResponse = {
	success: boolean;
	message: string;
};

/** 
 * Represents a database response that may include data 
 * @description A generic type that provides a type-safe way to return data from database operations
 * @template T The type of data that may be returned
 */
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

/** 
 * Represents a physical address 
 * @description Captures the components of a standard postal address
 */
type Address = {
	street: string;
	city: string;
	state: string;
	zip: number;
};

/** 
 * Adds an ID to a given type 
 * @description A utility type that adds an 'id' property to any type
 * @template T The base type to augment with an ID
 */
type RecordWithId<T> = { id: number } & T;

/** 
 * Represents the base user record without an ID 
 * @description Contains core user information before database storage
 */
export type BaseUserRecord = {
	firstName: string;
	lastName: string;
	email: string;
	hashedPassword: string;
};

/** 
 * Represents a complete user record with an ID 
 * @description A user record as stored in the database
 */
export type UserRecord = RecordWithId<BaseUserRecord>;

/** 
 * Represents the base customer record without an ID 
 * @description Contains detailed customer information before database storage
 */
export type BaseCustomerRecord = {
	userID: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: Address;
	deleted: number;
};

/** 
 * Represents a complete customer record with an ID 
 * @description A customer record as stored in the database
 */
export type CustomerRecord = RecordWithId<BaseCustomerRecord>;

/** 
 * Represents the base appointment record without an ID 
 * @description Contains detailed appointment information before database storage
 */
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

/** 
 * Represents a complete appointment record with an ID 
 * @description An appointment record as stored in the database
 */
export type AppointmentRecord = RecordWithId<BaseAppointmentRecord>;

/** 
 * Represents a authentication cookie 
 * @description Stores information about a user's session cookie
 */
export type cookie = {
	id: string;
	userID: number;
	expireTime: number;
};

/** 
 * Represents the base note record without an ID 
 * @description Contains core note information before database storage
 */
export type BaseNote = {
	title: string;
	note: string;
	createdDate: number;
	deleted: number;
};

/** 
 * Represents a complete note record with an ID 
 * @description A note record as stored in the database
 */
export type Note = RecordWithId<BaseNote>;

/** 
 * Represents the base service record without an ID 
 * @description Contains detailed service information before database storage
 */
export type BaseServiceRecord = {
	userID: number,
	name: string,
	description: string,
	price: number,
	deleted: 0 | 1
}

/** 
 * Represents a complete service record with an ID 
 * @description A service record as stored in the database
 */
export type ServiceRecord = RecordWithId<BaseServiceRecord>
