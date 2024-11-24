import type { BaseCustomerRecord } from '$lib/types';

class Customers {
	BasicMale: BaseCustomerRecord = {
		userID: 0,
		firstName: 'Mike',
		lastName: 'Johnson',
		email: 'MikeJohnson@gmail.com',
		phone: '123-123-1234',
		address: {
			street: 'Fake St',
			city: 'Ducker',
			state: 'MN',
			zip: 3456
		},
		deleted: 0
	};

	BasicFemale: BaseCustomerRecord = {
		userID: 0,
		firstName: 'Sarah',
		lastName: 'Williams',
		email: 'SarahW@outlook.com',
		phone: '555-867-5309',
		address: {
			street: '123 Oak Lane',
			city: 'Springfield',
			state: 'IL',
			zip: 62701
		},
		deleted: 0
	};

	SeniorCustomer: BaseCustomerRecord = {
		userID: 0,
		firstName: 'Robert',
		lastName: 'Anderson',
		email: 'RAnderson@yahoo.com',
		phone: '612-555-1234',
		address: {
			street: '789 Maple Drive',
			city: 'Riverside',
			state: 'CA',
			zip: 92501
		},
		deleted: 0
	};

	YoungProfessional: BaseCustomerRecord = {
		userID: 0,
		firstName: 'Emily',
		lastName: 'Chen',
		email: 'EmilyC@gmail.com',
		phone: '952-444-7890',
		address: {
			street: '456 Pine Court',
			city: 'Austin',
			state: 'TX',
			zip: 78701
		},
		deleted: 0
	};

	SuburbanMom: BaseCustomerRecord = {
		userID: 0,
		firstName: 'Jessica',
		lastName: 'Martinez',
		email: 'JMartinez@hotmail.com',
		phone: '763-999-4321',
		address: {
			street: '567 Willow Way',
			city: 'Eden Prairie',
			state: 'MN',
			zip: 55344
		},
		deleted: 0
	};
}

export const CustomerDataObject= new Customers()