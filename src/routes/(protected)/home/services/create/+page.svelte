<script lang="ts">
	import type { BaseServiceRecord } from '$lib/types';
	import { page } from '$lib/stores.svelte';
	import API from '$lib/db/api.js';
	import { goto } from '$app/navigation';
	page.set('Services');

	let { data } = $props();

	let service: BaseServiceRecord = $state({
		name: "",
		description: "",
		price: 0,
		deleted: 0,
		userID: data.userID,
	});

	async function onCreate() {
		const result = await API.createService(service);
		if (result.success) {
			goto('/home/services');
		}
	}
</script>

<div class="content">
	<form onsubmit={onCreate}>
		<div class="account">
			<div class="buttonRow">
				<div class="fullName">
					{service.name}
				</div>
				<div class="grow"></div>
				<button type="submit">Create Service</button>
			</div>
			<div class="inputs">
				<div class="left">
					<div>
						Name: <input type="text" name="firstName" id="" bind:value={service.name} minlength="2" required />
					</div>
					<div>
						Price: <input type="number" bind:value={service.price} required>
					</div>
				</div>
				<div class="description">
					<div>Description:</div>
					<textarea name="" id="" bind:value={service.description} maxlength="100"> </textarea>
				</div>
				
			</div>
		</div>
	</form>
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		justify-items: center;
	}

	.left {
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: 30px;
	}

	.account {
		display: flex;
		align-items: start;
		justify-content: center;
		flex-direction: column;
		background-color: var(--main);
		border-radius: 1rem;
		filter: drop-shadow(rgb(88, 88, 88) 0.2rem 0.2rem 1rem);

		padding: 2rem 4rem 4rem 4rem;
		gap: 20px;
	}

	.nameRow {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.contactRow {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 20px;
	}

	.addressRow {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.buttonRow {
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: center;
		justify-content: end;
		gap: 20px;
	}

	textarea {
		width: 300px;
		height: 150px;
		font-size: 1.2rem;
		resize: none;
		border: none;
		border-radius: 1rem;
		padding: 15px;
	}

	.grow {
		flex-grow: 1;
	}

	input {
		padding: 0.5rem;
		width: 7vw;
		outline: none;
		border: 3px solid transparent;
		border-radius: 0.3rem;
		font-size: 1rem;
	}

	input:disabled {
		padding: 0.5rem;
		width: 10vw;
		outline: none;
		background: none;
		color: black;
		border: 3px solid transparent;
		border-radius: 0.3rem;
		font-size: 1rem;
	}

	button {
		padding: 0.5rem;
		width: 10vw;
		font-size: 1.2rem;
		border: 2px solid transparent;
		background: var(--main-hover);
		border-radius: 0.25rem;
		transition: 0.25s;
		cursor: pointer;
	}

	button:hover {
		padding: 0.5rem;
		width: 10vw;
		font-size: 1.2rem;
		border: 2px solid yellow;
		transition: 0.25s;
	}

	.fullName {
		font-size: 1.5rem;
	}
</style>
