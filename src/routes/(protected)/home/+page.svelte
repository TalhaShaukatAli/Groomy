<script>
	import { authenticatedUser, page } from '$lib/stores.svelte';
	import { onMount } from 'svelte';

	page.set('Home');

	let { data } = $props()

	onMount(()=>{
		localStorage.setItem("authenticatedUserID", data.data._id.toString())
	})
</script>

<h1>Welcome</h1>
