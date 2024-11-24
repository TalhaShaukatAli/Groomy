import { AuthDatabaseService } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/auth') || !event.url.pathname.startsWith('/home')) {
		return await resolve(event);
	}

	//Get Cookie from Session
	const cookieID = event.cookies.get('sessionID');
	if (!cookieID) {
		redirect(302, '/login');
	}

	//Get cookie from database
	const databaseCookie = AuthDatabaseService.getCookie(cookieID);
	if (!databaseCookie.success || !authenticatedUser.get()) {
		redirect(302, '/login');
	}

	//Check if cookie is valid
	const cookieValid = databaseCookie.data.expireTime > Date.now();
	if (cookieValid) {
		//Refresh Cookie
		AuthDatabaseService.updateCookie(databaseCookie.data.id);
		event.locals.user = {
			id: databaseCookie.data.userID
		};
		return await resolve(event);

	} else {
		AuthDatabaseService.removeCookie(databaseCookie.data.id);
	}
};
