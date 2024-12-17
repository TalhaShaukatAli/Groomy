<script lang="ts">
	import API from '$lib/db/api';
	import { page } from '$lib/stores.svelte';
	import type { CustomerRecord, InvoiceRecord, ServiceRecord } from '$lib/types.js';

	page.set('Invoices');

	let { data } = $props();
	let invoices: InvoiceRecord[] | null = JSON.parse(data.invoices);
	let sortedInvoices = invoices
		? [...invoices].sort((a, b) => {
				const dateA = Number(a.createdDate.toString().replace(/,/g, ''));
				const dateB = Number(b.createdDate.toString().replace(/,/g, ''));

				return dateB - dateA;
			})
		: null;

	let customers: CustomerRecord[] | null = JSON.parse(data.customers);
	let servicesList: ServiceRecord[] = JSON.parse(data.services)

	function getCustomerForInvoice(customerID: number) {
		let test = customers.filter((i) => i.id === customerID);
		return test[0];
	}

	async function DeleteByID(id: number) {
		let confirmResult = confirm('Are you sure you want to delete this invoice?');
		if (confirmResult) {
			const result = await API.deleteInvoice(id);
			if (result.success) {
				window.location.reload();
			}
		}
	}

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


</script>

<div class="table">
	<a class="createNew" href="/home/invoices/create"> Create New Invoice > </a>
	{#if invoices == null || invoices.length === 0}
		You have no invoices created yet
	{:else}
		<div class="rows">
			{#each sortedInvoices as invoice}
				{@render serviceInvoice(invoice)}
			{/each}
		</div>
	{/if}
</div>

{#snippet serviceInvoice(data: InvoiceRecord)}
{@const tempServiceItems = JSON.parse(data.serviceItems)}
	<div class="row">
		<div class="top">
			<div class="fullName">
				Invoice {`${data.id}`}
			</div>
		</div>
		<div class="email">
			Client: {`${getCustomerForInvoice(data.customerID).firstName + ' ' + getCustomerForInvoice(data.customerID).lastName}`}
		</div>
		<div class="phone">
			Payment Due: {data.dueDate}
		</div>
		<div>
			Paid: {data.paid === 1 ? true : false}
		</div>
		<div>
			
			Total Price: {tempServiceItems.reduce((total, value) => total + parseFloat(calculateTotal(getServiceInfo(value.serviceID), value.quantity)), 0).toFixed(2)}
			
		</div>
		<div class="bottom">
			<div class="edit">
				<a href="/home/invoices/{data.id}">View</a>
				<a href="/home/invoices/{data.id}?edit=true">Edit</a>
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
