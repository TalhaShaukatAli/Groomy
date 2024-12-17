import type { BaseAppointmentRecord, BaseCustomerRecord, BaseServiceRecord } from '$lib/types';

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

export const CustomerDataObject = new Customers();

class Appointments {
	StandardGrooming: BaseAppointmentRecord = {
		userID: 0,
		customerID: 31,
		title: 'Full Grooming - Golden Retriever',
		description: 'Full service for Max: bath, haircut, nail trim, ear cleaning. Note: Sensitive to loud dryers.',
		time: {
			date: '2024-11-15',
			start: '09:00',
			end: '11:00',
			exact: 1731508800000
		},
		address: {
			street: '742 Maple Street',
			city: 'Springfield',
			state: 'IL',
			zip: 60601
		},
		deleted: 0
	};

	ExpressService: BaseAppointmentRecord = {
		userID: 0,
		customerID: 45,
		title: 'Bath & Nail Trim - Poodle',
		description: 'Express service for Bella: bath and nail trim only. Regular client - prefers hypoallergenic shampoo.',
		time: {
			date: '2024-11-18',
			start: '14:00',
			end: '15:00',
			exact: 1731526800000
		},
		address: {
			street: '123 Oak Lane',
			city: 'Springfield',
			state: 'IL',
			zip: 60602
		},
		deleted: 0
	};

	PuppyGrooming: BaseAppointmentRecord = {
		userID: 0,
		customerID: 52,
		title: 'Puppy First Groom - Shih Tzu',
		description: 'First-time puppy groom for Luna. Owner requests gentle introduction, extra treats okay.',
		time: {
			date: '2024-11-20',
			start: '10:00',
			end: '11:30',
			exact: 1731600000000
		},
		address: {
			street: '555 Pine Road',
			city: 'Springfield',
			state: 'IL',
			zip: 60603
		},
		deleted: 1
	};

	SeniorPetService: BaseAppointmentRecord = {
		userID: 0,
		customerID: 60,
		title: 'Senior Groom - Yorkshire Terrier',
		description: 'Gentle grooming for Charlie (13 years): bath, light trim, extra careful with arthritis in back legs.',
		time: {
			date: '2024-11-25',
			start: '11:30',
			end: '13:00',
			exact: 1731772800000
		},
		address: {
			street: '890 Elm Court',
			city: 'Springfield',
			state: 'IL',
			zip: 60604
		},
		deleted: 0
	};

	SpecialtyGrooming: BaseAppointmentRecord = {
		userID: 0,
		customerID: 75,
		title: 'De-matting Session - Maine Coon Cat',
		description: 'Special appointment for Milo: severe matting, needs careful handling. Owner will provide treats.',
		time: {
			date: '2024-11-30',
			start: '08:00',
			end: '10:00',
			exact: 1731859200000
		},
		address: {
			street: '234 Birch Avenue',
			city: 'Springfield',
			state: 'IL',
			zip: 60605
		},
		deleted: 0
	};
}

export const AppointmentDataObject = new Appointments();

class Services {
	BasicHaircut: BaseServiceRecord = {
		userID: 0,
		name: 'Basic Dog Haircut',
		description: 'Standard haircut for dogs, includes basic trimming and styling',
		price: 50,
		deleted: 0
	};

	PuppyFirstGroom: BaseServiceRecord = {
		userID: 0,
		name: 'Puppy First Groom',
		description: 'Gentle introduction to grooming for puppies, includes light bath and minimal trimming',
		price: 35,
		deleted: 0
	};

	FullGrooming: BaseServiceRecord = {
		userID: 0,
		name: 'Full Grooming Package',
		description: 'Comprehensive grooming service including bath, haircut, nail trim, ear cleaning, and anal gland expression',
		price: 75,
		deleted: 0
	};

	BathOnly: BaseServiceRecord = {
		userID: 0,
		name: 'Bath Only',
		description: 'Basic bath service with shampoo, conditioning, and blow-dry',
		price: 25,
		deleted: 0
	};

	NailTrim: BaseServiceRecord = {
		userID: 0,
		name: 'Nail Trim',
		description: 'Quick nail trimming service for pets',
		price: 15,
		deleted: 0
	};

	SeniorPetGrooming: BaseServiceRecord = {
		userID: 0,
		name: 'Senior Pet Grooming',
		description: 'Gentle grooming service tailored for older pets with special care and attention',
		price: 60,
		deleted: 0
	};

	DematService: BaseServiceRecord = {
		userID: 0,
		name: 'De-matting Service',
		description: 'Specialized service for removing and preventing matted fur, includes careful detangling',
		price: 45,
		deleted: 0
	};
}

export const ServiceDataObject = new Services();
