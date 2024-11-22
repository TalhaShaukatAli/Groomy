import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Auth_RemoveCookie } from '$lib/db/database';

export const GET: RequestHandler = async ({ cookies }) => {
	//@ts-expect-error
	Auth_RemoveCookie(cookies.get('sessionID'));
	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
