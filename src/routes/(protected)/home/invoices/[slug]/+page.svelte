<script lang="ts">
	import type { CustomerRecord, InvoiceRecord } from '$lib/types';
	import { page } from '$lib/stores.svelte';
	import API from '$lib/db/api.js';
	import { goto } from '$app/navigation';
	import Notes from '$lib/components/Notes.svelte';
	import { CustomerNoteServiceSingleton } from '$lib/db/noteHelper.js';

	page.set('Invoices');

	let { data } = $props();

	let invoice: InvoiceRecord = $state(JSON.parse(data.invoiceInfo) as InvoiceRecord);
	let customerList: CustomerRecord[] = $state(JSON.parse(data.customerInfo));
	let editView: boolean = $state(JSON.parse(data.editView));

	let customer: CustomerRecord = $derived(customerList.filter((customerIndividual) => customerIndividual.id == invoice.customerID)[0]);

	function changeToEdit() {
		editView = true;
	}

	async function onCancel() {
		editView = false;
		window.location.replace(`/home/invoices/${invoice.id}`);
	}

	async function onSave() {
		const result = await API.updateCustomer(customer);
		if (result.success) {
			await goto(`/home/invoices`);
		}
	}

	async function DeleteByID(id: number) {
		let confirmResult = confirm('Are you sure you want to delete this user?');
		if (confirmResult) {
			const result = await API.deleteInvoice(id);
			if (result.success) {
				await goto('/home/invoices');
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
						}}>Delete
					</button
					>
					<button
						type="button"
						onclick={() => {
							onCancel();
						}}>Cancel
					</button
					>
				{/if}
			</div>

			<div class="baseData">
				<div>
					Customer:
					<select name="" id="" disabled={!editView} bind:value={invoice.customerID} required>
						{#each customerList as customerItem}
							<option value={customerItem.id}
											selected={customerItem.id === invoice.customerID}>{customerItem.firstName + ' ' + customerItem.lastName}</option>
						{/each}
					</select>
				</div>
				<div>
						<span>
							Full Name: {customer.firstName + ' ' + customer.lastName}
						</span>
				</div>
				<div>
						<span>
							Phone: {customer.phone}
						</span>
				</div>
				<div>
						<span>
							Email: {customer.email}
						</span>
				</div>
			</div>

			<div class="nameRow">
				<div>
					First Name: <input type="text" name="firstName" id="" bind:value={customer.firstName} disabled={!editView}
														 required />
				</div>
				<div>
					Last Name: <input type="text" name="lastName" id="" bind:value={customer.lastName} disabled={!editView}
														required />
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
					Street: <input type="text" name="street" id="" bind:value={customer.address.street} disabled={!editView}
												 required />
				</div>
				<div>
					City: <input type="text" name="city" id="" bind:value={customer.address.city} disabled={!editView} required />
				</div>
				<div>
					State: <input type="text" name="state" id="" bind:value={customer.address.state} disabled={!editView}
												required />
				</div>
				<div>
					Zip Code: <input type="number" name="zip" id="" bind:value={customer.address.zip} disabled={!editView}
													 required />
				</div>
			</div>
		</div>
	</form>
	<Notes notesID={invoice.id} noteHelper={CustomerNoteServiceSingleton} />
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
