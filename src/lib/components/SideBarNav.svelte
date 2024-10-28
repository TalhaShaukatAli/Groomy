<script>
	import paw from '$lib/static/paw.png';

	import { page } from '$lib/stores.svelte';
</script>

<div class="sideBar">
	<div class="logo">
		<img src={paw} alt="" width="100px" />
		<b>Groomy</b>
	</div>
	<a class="sideBarItem" class:highlighted={page.get() === 'Home'} href="/home">Home</a>
	<a class="sideBarItem" class:highlighted={page.get() === 'Test'} href="/home/customers">Customers</a>
	<div style="flex-grow: 1;"></div>
	<a class="sideBarItem" href="/login/logout">Log Out</a>
</div>

<style>
	.highlighted {
		background-color: var(--main-hover) !important;
		color: white;
	}

	b {
		font-size: 1.7rem;
	}

	a {
		text-decoration: none;
		color: black;
	}

	img {
		padding: 0.25rem;
	}

	.sideBar {
		width: 100%;
		height: 100vh;
		background-color: var(--main);

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.sideBarItem {
		font-size: 1.2rem;
		width: 100%;
		text-align: center;
		padding: 1rem 0rem;
		cursor: pointer;
		transition: 0.25s;
	}

	.sideBarItem:hover {
		background-color: var(--main-hover);
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
	}
</style>
