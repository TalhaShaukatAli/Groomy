import { authenticatedUser } from "$lib/stores.svelte";

export const load: PageServerLoad = async () => {
    return {
        data:authenticatedUser.get()
    }
};