import { Auth_GetCookie, Auth_RemoveCookie, Auth_UpdateCookie } from '$lib/db/database';
import { authenticatedUser } from '$lib/stores.svelte';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/auth')) {
		return await resolve(event);
	}
	if (event.url.pathname.startsWith('/home') || event.url.pathname.startsWith('/api')) {
		const cookieID = event.cookies.get('sessionID');
		if (cookieID) {
			const dbCookie = Auth_GetCookie(cookieID);
			//If cookie doesn't exist, or user isn't saved, go back to login
			if (dbCookie == null || !authenticatedUser.get()) {
				redirect(302, '/login');
			}

			//If expiretime is still good, allow to protected page.
			if (dbCookie.expireTime > Date.now()) {
				Auth_UpdateCookie(dbCookie.id);
				event.locals.user = {
					id: dbCookie.userID
				};
				return await resolve(event);
			}
			//Remove Cookie otherwise
			Auth_RemoveCookie(dbCookie.id);
			redirect(302, '/login');
		}
		redirect(302, '/login');
		
	} else {
		return await resolve(event);
	}
};
