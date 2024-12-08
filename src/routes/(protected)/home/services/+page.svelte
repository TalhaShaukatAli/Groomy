<script lang="ts">
	import API from '$lib/db/api';
	import { page } from '$lib/stores.svelte';
	import type { ServiceRecord } from '$lib/types.js';
	page.set('Services');

	let { data } = $props();
	let services: ServiceRecord[] | null = JSON.parse(data.services);

	async function DeleteByID(id: number) {
		let confirmResult = confirm('Are you sure you want to delete this service?');
		if (confirmResult) {
			const result = await API.deleteService(id);
			if (result.success) {
				window.location.reload();
			}
		}
	}
</script>

<div class="table">
	<a class="createNew" href="/home/services/create"> Add New Service > </a>
	{#if services == null || services.length === 0}
		You have no services created yet
	{:else}
		<div class="rows">
			{#each services as service}
				{@render serviceRow(service)}
			{/each}
		</div>
	{/if}
</div>

{#snippet serviceRow(data: ServiceRecord)}
	<div class="row">
		<div class="top">
			<div class="fullName">
				{`${data.name}`}
			</div>
		</div>
		<div class="email">
			{'$' + data.price}
		</div>
		<div class="phone">
			{data.description}
		</div>
		<div class="bottom">
			<div class="edit">
				<a href="/home/services/{data.id}">View</a>
				<a href="/home/services/{data.id}?edit=true">Edit</a>
				<button
					onclick={() => {
						DeleteByID(data.id);
					}}>Delete</button
				>
			</div>
		</div>
	</div>
{/snippet}

<style>
	.table {
		width: 100%;
	}

	.createNew {
		position: absolute;
		bottom: 20px;
		right: 20px;
		padding: 1.5rem 3rem;
		z-index: 3;
		background-color: var(--main);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.3rem;
		border-radius: 0.5rem;
		filter: drop-shadow(rgba(187, 187, 187, 0.795) 0.2rem 0.2rem 0.6rem);
		transition: 0.25s;
		cursor: pointer;
		text-decoration: none;
		color: black;
	}

	.rows {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 50px;
		width: 100%;
	}

	.row {
		padding: 2rem 4rem;
		display: flex;
		flex-direction: column;
		grid-template-rows: auto;
		border: 5px solid var(--main);
		background-color: var(--background);
		border-radius: 1rem;
		font-size: 1.2rem;
		gap: 0.3rem;
		filter: drop-shadow(rgba(154, 179, 159, 0.795) 0.2rem 0.2rem 0.6rem);
		transition: 0.25s;
	}

	.row:hover {
		filter: drop-shadow(rgb(112, 112, 112) 0.2rem 0.2rem 1rem);
		transition: 0.25s;
	}

	.top {
		display: flex;
	}

	.bottom {
		display: flex;
		justify-content: end;
	}

	.edit {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		justify-content: end;
		font-weight: bold;
	}

	.edit a {
		color: black;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.3rem;
		font-size: 1rem;
	}

	.edit button {
		outline: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 0.3rem;
		font-weight: bold;
		font-size: 1rem;
	}

	.edit a:hover {
		background-color: var(--main-hover);
	}

	.edit button:hover {
		background-color: var(--main-hover);
	}

	.fullName {
		font-size: 1.4rem;
	}
</style>
