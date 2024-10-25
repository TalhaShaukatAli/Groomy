<script>
	import { page } from '$lib/stores.svelte';
	import Login from '$lib/components/Login.svelte';

	let { form } = $props();

	page.set('Login');

</script>

<div class="content">
	<Login {form}/>
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;
	}
</style>