import { authenticatedUser } from "$lib/stores.svelte";

export const load: PageServerLoad = async () => {
    let user = authenticatedUser.get()
    return {
        user:user
    }
};