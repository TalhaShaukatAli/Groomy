<script lang="ts">
	import type { BaseCustomerRecord } from '$lib/types';
	import { page } from '$lib/stores.svelte';
	import API from '$lib/db/api.js';
	import { goto } from '$app/navigation';
	page.set('Customer');

	let { data } = $props();

	let customer: BaseCustomerRecord = $state({
		userID: data.userID,
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: {
			street: '',
			city: '',
			state: '',
			zip: 1
		},
		deleted: 0
	});

	async function onCreate() {
		const result = await API.createCustomer(customer);
		if (result.success) {
			await goto('/home/customers');
		}
	}
</script>

<div class="content">
	<form onsubmit={onCreate}>
		<div class="account">
			<div class="buttonRow">
				<div class="fullName">
					{customer.firstName + ' ' + customer.lastName}
				</div>
				<div class="grow"></div>
				<button type="submit">Create Customer</button>
			</div>

			<div class="nameRow">
				<div>
					First Name: <input type="text" name="firstName" id="" bind:value={customer.firstName} required />
				</div>
				<div>
					Last Name: <input type="text" name="lastName" id="" bind:value={customer.lastName} required />
				</div>
			</div>
			<div class="contactRow">
				<div>
					Phone: <input type="text" name="phone" id="" bind:value={customer.phone} required />
				</div>
				<div>
					Email: <input type="text" name="email" id="" bind:value={customer.email} required />
				</div>
			</div>
			<div class="addressRow">
				<div>
					Street: <input type="text" name="street" id="" bind:value={customer.address.street} required />
				</div>
				<div>
					City: <input type="text" name="city" id="" bind:value={customer.address.city} required />
				</div>
				<div>
					State: <input type="text" name="state" id="" bind:value={customer.address.state} required />
				</div>
				<div>
					Zip Code: <input type="number" name="zip" id="" bind:value={customer.address.zip} required />
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

	.grow {
		flex-grow: 1;
	}

	input {
		padding: 0.5rem;
		width: 10vw;
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
