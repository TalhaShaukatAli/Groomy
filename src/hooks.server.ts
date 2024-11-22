import { Auth_GetCookie, Auth_RemoveCookie, Auth_UpdateCookie } from '$lib/db/database';
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
	console.log(cookieID)

	//Get cookie from database
	const databaseCookie = Auth_GetCookie(cookieID);
	if (databaseCookie == null || !authenticatedUser.get()) {
		redirect(302, '/login');
	}

	//Check if cookie is valid
	const cookieValid = databaseCookie.expireTime > Date.now();
	if (cookieValid) {
		//Refresh Cookie
		Auth_UpdateCookie(databaseCookie.id);
		event.locals.user = {
			id: databaseCookie.userID
		};
		return await resolve(event);

	} else {
		Auth_RemoveCookie(databaseCookie.id);
	}
};
