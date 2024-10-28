<script lang="ts">
	import { page } from '$lib/stores.svelte';
	import CustomerTable from "$lib/components/CustomerTable.svelte"
	import type { customerRecord } from '$lib/types';
	page.set('Test');

	let {data} = $props()
	let customers = JSON.parse(data.customers)
</script>

<CustomerTable {customers}/>
