import { connect } from '$lib/db/mongo';
import type { Handle } from '@sveltejs/kit';

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
	if(event.url.pathname.startsWith("/home")){
		console.log('sad');
        return await resolve(event);
	} else {
        return await resolve(event);
    }
};
