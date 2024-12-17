<script lang="ts">
	import type { CustomerRecord, InvoiceRecord, ServiceRecord } from '$lib/types';
	import { page } from '$lib/stores.svelte';
	import API from '$lib/db/api.js';
	import { goto } from '$app/navigation';
	import Notes from '$lib/components/Notes.svelte';
	import { CustomerNoteServiceSingleton, InvoiceNoteServiceSingleton } from '$lib/db/noteHelper.js';

	page.set('Invoices');

	let { data } = $props();

	let invoice: InvoiceRecord = $state(JSON.parse(data.invoiceInfo) as InvoiceRecord);
	let customerList: CustomerRecord[] = $state(JSON.parse(data.customerInfo));
	let servicesList: ServiceRecord[] = $state(JSON.parse(data.servicesInfo));
	let editView: boolean = $state(JSON.parse(data.editView));
	let tempServiceItems = $state(JSON.parse(invoice.serviceItems)) as { serviceID: number; quantity: number }[];

	$inspect(tempServiceItems);

	let customer: CustomerRecord = $derived(customerList.filter((customerIndividual) => customerIndividual.id == invoice.customerID)[0]);

	function getServiceInfo(serviceID: number): ServiceRecord {
		const defaultService: ServiceRecord = {
			id: serviceID,
			name: 'Service Not Found',
			description: 'Service details unavailable',
			price: 0,
			userID: 0,
			deleted: 0
		};
		return servicesList.find((service) => service.id === serviceID) ?? defaultService;
	}

	function calculateTotal(service: ServiceRecord, quantity: number): string {
		if (!service?.price || !quantity) return '0.00';
		return (service.price * quantity).toFixed(2);
	}

	let overallTotal = $derived(tempServiceItems.reduce((total, value) => total + parseFloat(calculateTotal(getServiceInfo(value.serviceID), value.quantity)), 0).toFixed(2))
	$inspect(overallTotal)

	function handlePaidChange(event: Event) {
		const checkbox = event.target as HTMLInputElement;
		invoice.paid = checkbox.checked ? 1 : 0;
	}

	function changeToEdit() {
		editView = true;
	}

	async function onCancel() {
		editView = false;
		window.location.replace(`/home/invoices/${invoice.id}`);
	}

	async function onSave() {
		invoice.serviceItems = JSON.stringify(tempServiceItems);
		const result = await API.updateInvoice(invoice);
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
				<div class="grow"></div>
				{#if !editView}
					<button type="button" onclick={changeToEdit}>Edit Invoice</button>
				{:else}
					<button type="submit">Save</button>
					<button
						type="button"
						onclick={() => {
							DeleteByID(customer.id);
						}}
						>Delete
					</button>
					<button
						type="button"
						onclick={() => {
							onCancel();
						}}
						>Cancel
					</button>
				{/if}
			</div>

			<div class="header">Groomy</div>

			<div class="secondHeader">
				<div>
					<b> Invoice Number: </b>
					{invoice.id}
				</div>
				<div>
					<b> Service Date: </b>
					<input type="date" name="Date" id="" bind:value={invoice.date} disabled={!editView} required />
				</div>
				<div>
					<b> Payment Due Date: </b>
					<input type="date" name="Date" id="" bind:value={invoice.dueDate} disabled={!editView} required />
				</div>
				<div>
					<b>Payment Recieved</b>
					<input type="checkbox" checked={invoice.paid === 1} onchange={handlePaidChange} disabled={!editView} />
				</div>
			</div>

			<div class="billTo">
				<div class="billee">
					<b> Billed To: </b>
					<select name="" id="" disabled={!editView} hidden={!editView} bind:value={invoice.customerID} required>
						{#each customerList as customerItem}
							<option value={customerItem.id} selected={customerItem.id === invoice.customerID}>{customerItem.firstName + ' ' + customerItem.lastName}</option>
						{/each}
					</select>
					<div class="nameRow">
						{customer.firstName + ' ' + customer.lastName}
					</div>
					<div class="addressRow">
						{customer.address.street}
						{customer.address.city}, {customer.address.state}
						{customer.address.zip}
					</div>
					<div>
						{customer.email}
					</div>
				</div>
				<div class="biller">
					<b> From: </b>
					<div class="nameRow">Groomy LLC</div>
					<div class="addressRow">1234 Fake Rd, Bemidji, MN, 56601</div>
					<div>billing@groomy.com</div>
				</div>
			</div>
			<b>Services</b>
			<div class="services">
				{#if tempServiceItems.length == 0}
					No services added yet
				{:else}
					<span style="grid-column: 1; text-align:center; text-decoration:underline">Name</span>
					<span style="grid-column: 2; text-align:center; text-decoration:underline">Description</span>
					<span style="grid-column: 3; text-align:center; text-decoration:underline">Quantity</span>
					<span style="grid-column: 4; text-align:center; text-decoration:underline">Price</span>
					<span style="grid-column: 5; text-align:center; text-decoration:underline">Total</span>

					{#each tempServiceItems as serviceData, i}
						{@render service(serviceData.serviceID, serviceData.quantity, i)}
					{/each}
					<span style="grid-column: 5; text-align:center; text-decoration:underline">{overallTotal}</span>
				{/if}

				{#if editView}
					<button type="button" style="font-size:.9rem; padding: .5rem; grid-column: 1;" onclick={()=>{tempServiceItems.push({serviceID: 0, quantity: 0})}}>Add Service</button>
				{/if}
			</div>
		</div>
	</form>
	<Notes notesID={invoice.id} noteHelper={InvoiceNoteServiceSingleton} />
</div>

{#snippet service(serviceID: number, quantity: number, i: number)}
	{@const serviceInfo = getServiceInfo(serviceID)}
	<div style="grid-column: 1;">
		<select name="" id="" disabled={!editView} bind:value={tempServiceItems[i].serviceID} required>
			{#each servicesList as serviceItem}
				<option value={serviceItem.id} selected={serviceItem.id === tempServiceItems[i].serviceID}>{serviceItem.name}</option>
			{/each}
		</select>
	</div>
	<div style="grid-column: 2;">
		{serviceInfo.description}
	</div>
	<div style="grid-column: 3;">
		<input type="number" style="width: 3rem;" name="" id="" bind:value={tempServiceItems[i].quantity} disabled={!editView}>
	</div>
	<div style="grid-column: 4;">
		{serviceInfo.price?.toFixed(2) ?? '0.00'}
	</div>
	<div style="grid-column: 5;">
		{calculateTotal(serviceInfo, quantity)}
	</div>
	<div style="grid-column: 6; color: red; cursor:pointer" hidden={!editView}>
		X
	</div>
{/snippet}

<style>
	.services {
		display: grid;
		grid-template-columns: 2fr, 4fr, 1fr;
		row-gap: 10px;
		width: 700px;
		text-align: center;
		justify-items: center;
		align-items: center;
	}

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

	select {
		outline: none;
		border: none;
		border-radius: .2rem;
		padding: .3rem .5rem;
		font-size: .9rem;
	}

	input {
		padding: 0.4rem;
		outline: none;
		border: 3px solid transparent;
		border-radius: 0.3rem;
		font-size: 1rem;
	}

	input:disabled {
		padding: 0.5rem;
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

	.header {
		display: flex;
		flex-direction: row;
		font-size: 1.75rem;
	}

	.secondHeader {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.billTo {
		display: flex;
		flex-direction: row;
		gap: 30px;
	}

	.billee {
		display: flex;
		flex-direction: column;
	}
</style>
