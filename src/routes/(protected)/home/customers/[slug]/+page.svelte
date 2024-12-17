<script lang="ts">
	import type { CustomerRecord } from '$lib/types';
	import { page } from '$lib/stores.svelte';
	import API from '$lib/db/api.js';
	import { goto } from '$app/navigation';
	import Notes from '$lib/components/Notes.svelte';
	import { CustomerNoteServiceSingleton } from '$lib/db/noteHelper.js';
	page.set('Customer');

	let { data } = $props();

	let customer: CustomerRecord = $state(JSON.parse(data.customerInfo) as CustomerRecord);
	let editView: boolean = $state(JSON.parse(data.editView));

	function changeToEdit() {
		editView = true;
	}

	async function onCancel() {
		editView = false;
		window.location.replace(`/home/customers/${customer.id}`);
	}

	async function onSave() {
		const result = await API.updateCustomer(customer);
		if (result.success) {
			await goto(`/home/customers`);
		}
	}

	async function DeleteByID(id: number) {
		let confirmResult = confirm('Are you sure you want to delete this user?');
		if (confirmResult) {
			const result = await API.deleteCustomer(id);
			if (result.success) {
				await goto('/home/customers');
			}
		}
	}
</script>

<div class="content">
	<form onsubmit={onSave}>
		<div class="account">
			<div class="buttonRow">
				<div class="fullName">
					{customer.firstName + ' ' + customer.lastName}
				</div>
				<div class="grow"></div>
				{#if !editView}
					<button type="button" onclick={changeToEdit}>Edit Customer</button>
				{:else}
					<button type="submit">Save</button>
					<button
						type="button"
						onclick={() => {
							DeleteByID(customer.id);
						}}>Delete</button
					>
					<button
						type="button"
						onclick={() => {
							onCancel();
						}}>Cancel</button
					>
				{/if}
			</div>

			<div class="nameRow">
				<div>
					First Name: <input type="text" name="firstName" id="" bind:value={customer.firstName} disabled={!editView} required />
				</div>
				<div>
					Last Name: <input type="text" name="lastName" id="" bind:value={customer.lastName} disabled={!editView} required />
				</div>
			</div>
			<div class="contactRow">
				<div>
					Phone: <input type="text" name="phone" id="" bind:value={customer.phone} disabled={!editView} required />
				</div>
				<div>
					Email: <input type="text" name="email" id="" bind:value={customer.email} disabled={!editView} required />
				</div>
			</div>
			<div class="addressRow">
				<div>
					Street: <input type="text" name="street" id="" bind:value={customer.address.street} disabled={!editView} required />
				</div>
				<div>
					City: <input type="text" name="city" id="" bind:value={customer.address.city} disabled={!editView} required />
				</div>
				<div>
					State: <input type="text" name="state" id="" bind:value={customer.address.state} disabled={!editView} required />
				</div>
				<div>
					Zip Code: <input type="number" name="zip" id="" bind:value={customer.address.zip} disabled={!editView} required />
				</div>
			</div>
		</div>
	</form>
	<Notes notesID={customer.id} noteHelper={CustomerNoteServiceSingleton} />
</div>

<style>
	.content {
		display: grid;
		grid-template-columns: 1fr 400px;
		align-items: center;
		height: 100%;
	}
	.account {
		display: flex;
		align-items: start;
		justify-content: center;
		flex-direction: column;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
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
		width: 7vw;
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
