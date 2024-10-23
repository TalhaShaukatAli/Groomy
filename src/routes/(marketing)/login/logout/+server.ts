import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { RemoveCookie } from '$lib/db/database';

export const GET: RequestHandler = async ({ url,cookies }) => {

    RemoveCookie(cookies.get("sessionID")).then((value)=>{})
    cookies.delete("sessionID", { path: '/' })
    redirect(302,"/login")
};
