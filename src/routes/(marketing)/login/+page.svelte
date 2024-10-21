<script>
	import { page } from '$lib/stores.svelte';

	page.set('Login');

	let regexEmail = String.raw`((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])`;
</script>

<div class="content">
	<div class="login">
		<div class="header">Login</div>
		<form action="">
			<div class="inputField">
				<label for="email">Email</label>
				<input type="email" placeholder="Example@gmail.com" name="" id="" pattern={regexEmail} />
			</div>
			<br />
			<div class="inputField">
				<label for="email">Password</label>
				<input type="password" placeholder="ABC123" name="" id="" />
			</div>
		</form>
	</div>
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;
	}

	.header {
		margin: 2rem 5rem;
		color: white;
		font-size: 2rem;
	}

	.login {
		background-color: var(--main);
		border-radius: 1rem;
	}

    form {
		padding: 5rem;
		padding-top: 1.5rem;
    }

	input {
		padding: 0.75rem;
		width: 18vw;
		outline: none;
		border: 3px solid transparent;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.inputField {
		display: flex;
		flex-direction: column;
		font-size: 1.1rem;
		color: white;
	}
</style>
