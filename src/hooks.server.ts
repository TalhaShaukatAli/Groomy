import { updated } from '$app/stores';
import { GetCookie, RemoveCookie, UpdateCookie } from '$lib/db/database';
import { connect } from '$lib/db/mongo';
import { redirect, type Handle } from '@sveltejs/kit';

// Connect to MongoDB before starting the server
connect()
	.then((): void => {
		console.log('MongoDB started');
	})
	.catch((e) => {
		console.log('MongoDB failed to start');
		console.log(e);
	});

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/home')) {
		const cookie = event.cookies.get('sessionID');
		if (cookie) {
			const dbCookie = await GetCookie(cookie);
			if (dbCookie.expireTime > Date.now()) {
				await UpdateCookie(dbCookie.cookie);
				return await resolve(event);
			}
			await RemoveCookie(dbCookie.cookie);
			redirect(302, '/login');
		}
		redirect(302, '/login');
	} else {
		return await resolve(event);
	}
};
