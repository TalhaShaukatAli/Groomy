<script>
	import { authenticatedUser, page } from '$lib/stores.svelte';

	page.set('Home');

	let { data } = $props()

	localStorage.setItem("authenticatedUserID", data.data._id.toString())
</script>

<h1>Welcome</h1>
