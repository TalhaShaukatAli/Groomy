<script>
	import paw from '$lib/static/paw.png';
</script>

<div class="sideBar">
	<div class="logo">
		<img src={paw} alt="" width="100px" />
		<b>Groomy</b>
	</div>
	<a class="sideBarItem"> Home </a>
</div>

<style>
	b {
		font-size: 1.7rem;
	}
	img {
		padding: 0.25rem;
	}
	.sideBar {
		width: 100%;
		height: 100vh;
		background-color: rgb(241, 161, 108);

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.sideBarItem {
		font-size: 1.5rem;
		width: 100%;
		text-align: center;
		padding: 1rem 0rem;
		cursor: pointer;
		transition: 0.25s;
	}

	.sideBarItem:hover {
		background-color: rgb(240, 144, 81);
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
	}
</style>
