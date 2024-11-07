import type { ObjectId } from 'mongodb';

export type userRecord = {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type newUserRecord = {
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
	userID: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: number;
	};
	deleted: boolean;
};

export type customerRecord = {
	_id: ObjectId;
	userID: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: number;
	};
	deleted: boolean;
};

export type appointmentRecord = {
	_id: ObjectId;
	time: {
		date: string;
		start: string;
		end: string;
		exact: number;
	};
	userID: string;
	customerID: string;
	title: string;
	description: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: number;
	};
	deleted: boolean;
};

export type newAppointmentRecord = {
	time: {
		date: string;
		start: string;
		end: string;
		exact: number;
	};
	userID: string;
	customerID: string;
	title: string;
	description: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: number;
	};
	deleted: boolean;
};
