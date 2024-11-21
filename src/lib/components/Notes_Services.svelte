<script lang="ts">
	import API from '$lib/db/api';
	import type { BaseNote, Note } from '$lib/types';
	import { onMount } from 'svelte';

	let { notesID: serviceID } = $props();
	let noteArray: Note[] = $state([]);
	let noteArrayLength = $derived(noteArray.length);

	onMount(() => {
		API.getServiceNotes(serviceID).then((value) => {
			noteArray = value.data;
		});
	});

	function reload() {
		API.getServiceNotes(serviceID).then((value) => {
			noteArray = value.data;
		});
		selectedNote = null;
	}

	let selectedNote: Note | null = $state(null);
	function changeSelectedNote(index: number) {
		selectedNote = noteArray[index];
	}

	let createMode = $state(false);
	let newNote: BaseNote = $state({
		title: '',
		note: '',
		createdDate: Date.now(),
		deleted: 0
	});
	function setCreateModeTo(mode: boolean) {
		createMode = mode;
		newNote = {
			title: '',
			note: '',
			createdDate: Date.now(),
			deleted: 0
		};
	}

	let editMode = $state(false);
	function setEditModeTo(mode: boolean) {
		editMode = mode;
	}

	async function saveNewNote() {
		const result = await API.createServiceNote(serviceID, newNote);
		reload();
		setCreateModeTo(false);
	}

	async function saveEdit() {
		//@ts-ignore
		const result = await API.UpdateNoteByID(selectedNote);
		setEditModeTo(false);
	}

	async function deleteNote(noteID: number) {
		let message = confirm('Are you sure you want to delete this note?');
		if (message) {
			const result = await API.DeleteNoteByID(noteID);
			reload();
		}
	}
</script>

<div class="content">
	<div class="header">Notes</div>
	<div class="buttonRow">
		{#if createMode}
			<button
				onclick={() => {
					setCreateModeTo(false);
				}}>Cancel</button
			>
		{:else}
			<button
				onclick={() => {
					setCreateModeTo(true);
				}}>Add Note</button
			>
		{/if}
	</div>
	{#if !createMode}
		<div class="table">
			{#if noteArrayLength == 0}
				<div class="faint">No notes created yet. Create a note to get started.</div>
			{:else}
				{#each noteArray as note, i}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						onclick={() => {
							changeSelectedNote(i);
						}}
						class:highlight={selectedNote?.id == note.id}
						class="tableItem"
					>
						{i + 1}: {note.title}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
	<div class="header2">Note Viewer</div>
	<div class="noteContent">
		{#if !createMode}
			{#if selectedNote != null}
				<input type="text" bind:value={selectedNote.title} placeholder="Title" disabled={!editMode} />
				<textarea name="" id="" bind:value={selectedNote.note} placeholder="Description" disabled={!editMode}></textarea>
				<div class="buttonRow">
					{#if editMode}
						<button
							onclick={() => {
								saveEdit();
							}}>Save</button
						>
						<button
							onclick={() => {
								//@ts-expect-error
								deleteNote(selectedNote?.id);
							}}>Delete</button
						>
						<button
							onclick={() => {
								setEditModeTo(false);
								reload();
							}}>Cancel</button
						>
					{:else}
						<button
							onclick={() => {
								setEditModeTo(true);
							}}>Edit</button
						>
					{/if}
				</div>
			{:else}
				<div class="faint">Select a note to display it</div>
			{/if}
		{:else}
			<form onsubmit={saveNewNote} class="noteContent">
				<input type="text" bind:value={newNote.title} placeholder="Title" minlength="3" maxlength="20" required />
				<textarea name="" id="" bind:value={newNote.note} placeholder="Description" minlength="0" required></textarea>
				<div class="buttonRow">
					<button type="submit">Save</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	.content {
		background-color: var(--main);
		padding: 3rem;
		border-radius: 1rem;
		filter: drop-shadow(rgb(88, 88, 88) 0.2rem 0.2rem 1rem);
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.header {
		font-size: 1.5rem;
	}

	.header2 {
		font-size: 1.3rem;
	}

	.tableItem {
		border: 2px solid var(--main);
		border-radius: 0.2rem;
		padding: 1rem;
		cursor: pointer;
	}

	.table {
		height: 200px;
		overflow-y: scroll;
		background-color: white;
		padding: 15px;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 1rem;
	}

	.highlight {
		background-color: var(--main);
	}

	.faint {
		opacity: 50%;
	}

	.noteContent {
		display: flex;
		flex-direction: column;
		border-radius: 1rem;
		gap: 15px;
		width: 100%;
	}

	.buttonRow {
		display: flex;
		flex-direction: row;
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
		outline: none;
		background: rgba(255, 255, 255, 0.534);
		color: rgba(0, 0, 0, 0.514);
		border: 3px solid transparent;
		border-radius: 0.3rem;
		font-size: 1rem;
	}

	button {
		padding: 0.5rem;
		width: 6vw;
		font-size: 1rem;
		border: 2px solid transparent;
		background: var(--main-hover);
		border-radius: 0.25rem;
		transition: 0.25s;
		cursor: pointer;
	}

	button:hover {
		border: 2px solid yellow;
		transition: 0.25s;
	}

	textarea {
		width: auto;
		height: 200px;
		font-size: 1.2rem;
		resize: none;
		border: none;
		border-radius: 1rem;
		padding: 15px;
	}
</style>
