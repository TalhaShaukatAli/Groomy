import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Auth_RemoveCookie } from '$lib/db/database';

export const GET: RequestHandler = async ({ url, cookies }) => {
	Auth_RemoveCookie(cookies.get('sessionID')).then((value) => {});
	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
