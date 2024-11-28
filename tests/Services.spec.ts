import { test } from '@playwright/test';
import { TestMapping } from './Mapping';
import { ServiceDataObject } from './DataObjects';

const testEmail = 'test@gmail.com';
	const testPassword = 'test123';

test("Retrive data correctly", async ({page}) => {
    const map = new TestMapping(page);

    await map.Account_Login(testEmail, testPassword)
	await map.GoTo('Services');

    await map.AssertService(ServiceDataObject.BasicHaircut);
})

test("Create and delete service", async ({ page }) => {
	const map = new TestMapping(page);

    await map.Account_Login(testEmail, testPassword)
	await map.GoTo('Services');

    await map.Create_Service(ServiceDataObject.BathOnly);
    await map.AssertService(ServiceDataObject.BathOnly);
    await map.Service_Delete(ServiceDataObject.BathOnly.name);
    await map.AssertNotService(ServiceDataObject.BathOnly);

});

test("Create and delete service from edit", async ({ page }) => {
	const map = new TestMapping(page);

    await map.Account_Login(testEmail, testPassword)
	await map.GoTo('Services');

    await map.Create_Service(ServiceDataObject.DematService);
    await map.AssertService(ServiceDataObject.DematService);
    await map.Service_DeleteFromEdit(ServiceDataObject.DematService.name);
    await map.AssertNotService(ServiceDataObject.DematService);
});