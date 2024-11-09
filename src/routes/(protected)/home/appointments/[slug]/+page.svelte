<script lang="ts">
	import type { AppointmentRecord, CustomerRecord } from '$lib/types';
	import { authenticatedUser, page } from '$lib/stores.svelte';
	import API from '$lib/db/api.js';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { DateTimeCombiner } from '$lib';
	import { onMount } from 'svelte';
	page.set('Appointment');

	let { data } = $props();
	let customerList: CustomerRecord[] = $state();

	let appointment: AppointmentRecord = $state(JSON.parse(data.appointmentInfo));
	let editView: boolean = $state(JSON.parse(data.editView));

	onMount(() => {
		const id = localStorage.getItem('authenticatedUserID') || '';

		API.getCustomers(id).then((value) => {
			customerList = value.data;
		});

		appointment.userID = id;
	});

	function changeToEdit() {
		editView = true;
	}

	async function cancel() {
		editView = false;
		await invalidateAll();
	}

	async function onSave() {
		const result = await API.updateAppointment(appointment);
		if (result.success) {
			goto(`/home/appointments`);
		}
	}

	async function onDelete(id: string) {
		let confirmResult = confirm('Are you sure you want to delete this appointment?');
		if (confirmResult) {
			const result = await API.deleteAppointment(id);
			if (result.success) {
				goto('/home/appointments');
			}
		}
	}

	async function updateTime() {
		let result = DateTimeCombiner(appointment.time.date, appointment.time.start);
		appointment.time.exact = result;
	}

	async function updateCustomer(e: Event) {
		appointment.customerID = e.target.value;
	}

	let customer: CustomerRecord = $state();
	$effect(() => {
		API.getCustomerByID(appointment.customerID).then((value) => {
			customer = value.data;
		});
	});
</script>

<div class="content">
	{#if editView}
		<div class="account">
			<div class="buttonRow">
				<div class="fullName">
					{appointment.title}
				</div>
				<div class="grow"></div>
				<button onclick={onSave}>Save</button>
				<button
					onclick={() => {
						onDelete(appointment._id.toString());
					}}>Delete</button
				>
				<button
					onclick={() => {
						cancel();
					}}>Cancel</button
				>
			</div>

			<div class="topRow">
				<div class="baseData">
					<div>
						Title: <input type="text" name="Date" id="" bind:value={appointment.title} />
					</div>
					<div>
						Date: <input type="date" name="Date" id="" bind:value={appointment.time.date} onclick={updateTime} />
					</div>
					<div>
						Time Start: <input type="time" name="timeStart" id="" bind:value={appointment.time.start} onchange={updateTime} />
					</div>
					<div>
						Time End: <input type="time" name="timeStart" id="" bind:value={appointment.time.end} onchange={updateTime} />
					</div>
				</div>
				<div class="gap"></div>
				<div class="baseData">
					<div>
						Street: <input type="text" name="street" id="" bind:value={appointment.address.street} />
					</div>
					<div>
						City: <input type="text" name="city" id="" bind:value={appointment.address.city} />
					</div>
					<div>
						State: <input type="text" name="state" id="" bind:value={appointment.address.state} />
					</div>
					<div>
						Zip Code: <input type="text" name="zip" id="" bind:value={appointment.address.zip} />
					</div>
				</div>
				<div class="baseData">
					{#if customer}
						<div>
							Customer:
							<select
								name=""
								id=""
								onchange={(e) => {
									updateCustomer(e);
								}}
							>
								{#each customerList as customer}
									<option value={customer._id.toString()} selected={customer._id.toString() === appointment.customerID}>{customer.firstName + ' ' + customer.lastName}</option>
								{/each}
							</select>
						</div>
						<div>
							<span>
								Full Name:
								{customer.firstName + ' ' + customer.lastName}
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
						<div>
							<span>
								{customer.address.street + ' '} <br />
								{`${customer.address.city}, ${customer.address.state} ${customer.address.zip} `}
							</span>
						</div>
					{/if}
				</div>
			</div>
			<div class="description">
				<div>Description:</div>
				<textarea name="" id="" bind:value={appointment.description}> </textarea>
			</div>
		</div>
	{:else}
		<div class="account">
			<div class="buttonRow">
				<div class="fullName">
					{appointment.title}
				</div>
				<div class="grow"></div>
				<button
					onclick={() => {
						changeToEdit();
					}}>Edit</button
				>
			</div>

			<div class="topRow">
				<div class="baseData">
					<div>
						Title: <input type="text" name="Date" id="" bind:value={appointment.title} disabled />
					</div>
					<div>
						Date: <input type="date" name="Date" id="" bind:value={appointment.time.date} disabled />
					</div>
					<div>
						Time Start: <input type="time" name="timeStart" id="" bind:value={appointment.time.start} disabled />
					</div>
					<div>
						Time End: <input type="time" name="timeStart" id="" bind:value={appointment.time.end} disabled />
					</div>
				</div>
				<div class="gap"></div>
				<div class="baseData">
					<div>
						Street: <input type="text" name="street" id="" bind:value={appointment.address.street} disabled />
					</div>
					<div>
						City: <input type="text" name="city" id="" bind:value={appointment.address.city} disabled />
					</div>
					<div>
						State: <input type="text" name="state" id="" bind:value={appointment.address.state} disabled />
					</div>
					<div>
						Zip Code: <input type="text" name="zip" id="" bind:value={appointment.address.zip} disabled />
					</div>
				</div>
				<div class="baseData">
					{#if customer}
						<div>
							Customer:
							<select name="" id="" disabled>
								{#each customerList as customerItem}
									<option value={customerItem._id.toString()} selected={customerItem._id.toString() === appointment.customerID}>{customerItem.firstName + ' ' + customerItem.lastName}</option>
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
						<div>
							<span>
								{customer.address.street + ' '} <br />
								{`${customer.address.city}, ${customer.address.state} ${customer.address.zip}`}
							</span>
						</div>
					{/if}
				</div>
			</div>
			<div class="description">
				<div>Description:</div>
				<textarea name="" id="" bind:value={appointment.description} disabled></textarea>
			</div>
		</div>
	{/if}
</div>

<style>
	select {
		background-color: white;
		border: none;
		padding: 0.5rem;
		width: 10vw;
		font-size: 1rem;
	}

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

	.topRow {
		display: flex;
		flex-direction: row;
		gap: 30px;
		margin: 0rem 2rem;
		flex-grow: 0;
	}

	.baseData {
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: end;
		gap: 20px;
		justify-content: center;
	}

	.gap {
		flex-grow: 1;
	}

	.description {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: start;

		gap: 10px;
	}

	textarea {
		width: 450px;
		height: 200px;
		font-size: 1.2rem;
		resize: none;
		border: none;
		border-radius: 1rem;
		padding: 15px;
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

	span {
		display: flex;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 0.2rem;
		min-width: 14vw;
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
