import { test, expect } from '@playwright/test';
import { TestMapping } from './Mapping';
import { AppointmentDataObject } from './DataObjects';

test.describe('Create Appointments', async () => {
	const email = 'test@gmail.com';
	const password = 'test123';
	test('existing appointment', async ({ page }) => {
		const map = new TestMapping(page)

		await map.Account_Login(email, password)
		await map.AssertAppointment(AppointmentDataObject.ExpressService)
	});

	test('create and edit appointment', async ({ page }) => {
		const map = new TestMapping(page)

		await map.Account_Login(email, password)
		await map.Appointment_Create(AppointmentDataObject.PuppyGrooming)
		await map.AssertAppointment(AppointmentDataObject.PuppyGrooming)
		await map.Appointment_Edit(AppointmentDataObject.PuppyGrooming.title, AppointmentDataObject.SeniorPetService)
		await map.AssertAppointment(AppointmentDataObject.SeniorPetService)
		await map.Appointment_Delete(AppointmentDataObject.SeniorPetService.title)
	});

	test('create and delete', async ({ page }) => {
		const map = new TestMapping(page)

		await map.Account_Login(email, password)
		await map.Appointment_Create(AppointmentDataObject.PuppyGrooming)
		await map.AssertAppointment(AppointmentDataObject.PuppyGrooming)
		await map.Appointment_DeleteFromEdit(AppointmentDataObject.PuppyGrooming.title)
	});
});
