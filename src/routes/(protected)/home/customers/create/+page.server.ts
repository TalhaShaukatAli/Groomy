import { authenticatedUser } from "$lib/stores.svelte";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({locals}) => {
    let a = locals.user?.id
    return {
        id: a
    }
};