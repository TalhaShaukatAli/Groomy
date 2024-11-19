<script lang="ts">
	import { page } from '$lib/stores.svelte';
	import type { ServiceRecord } from '$lib/types.js';
	page.set('Services');

	let { data } = $props();
	let services: ServiceRecord[] = JSON.parse(data.services);
</script>