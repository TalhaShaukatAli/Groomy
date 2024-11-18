import { authenticatedUser } from "$lib/stores.svelte";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({locals}) => {
    let userID = locals.user?.id
    return {
        userID: userID
    }
};