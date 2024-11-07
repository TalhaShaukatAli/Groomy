<script lang="ts">
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { authenticatedUser } from "$lib/stores.svelte";
    import type {ActionData} from "./$types"
	let { form }: {form :ActionData} = $props();
	
    let regexEmail = String.raw`((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])`;
	let login = $state(true);

	function changeLogin() {
		login = !login;
	}

</script>
<div class="login">
    {#if login}
        <div class="head">
            <div class="header">Login</div>
            <button class="question" onclick={changeLogin}>
                Don't have an account? <span style="color: yellow;">Click Here</span>
            </button>
        </div>
        <form action="?/login" method="post" use:enhance>
            <div class="inputField">
                <label for="email">Email</label>
                <input
                    type="email"
                    placeholder="Example@gmail.com"
                    name="email"
                    pattern={regexEmail}
                    required
                />
            </div>
            <br />
            <div class="inputField">
                <label for="password">Password</label>
                <input type="password" placeholder="ABC123" name="password" required />
            </div>
            <button type="submit" class="signin">Login</button>
            {#if form?.error}
                <p class="error">{form.error}</p>
            {/if}
        </form>
    {:else}
        <div class="head">
            <div class="header">Create Account</div>
            <button class="question" onclick={changeLogin}>
                Already have an account? <span style="color: yellow;">Click Here</span>
            </button>
        </div>
        <form action="?/create" method="post">
            <div class="inputField">
                <label for="firstname">First Name</label>
                <input type="text" placeholder="FirstName" name="firstName" max="20" required />
            </div>
            <br />
            <div class="inputField">
                <label for="email">Last Name</label>
                <input type="text" placeholder="LastName" name="lastName" max="20" required />
            </div>
            <br />
            <div class="inputField">
                <label for="email">Email</label>
                <input
                    type="email"
                    placeholder="Example@gmail.com"
                    name="email"
                    pattern={regexEmail}
                    required
                />
            </div>
            <br />
            <div class="inputField">
                <label for="email">Password</label>
                <input type="password" placeholder="ABC123" name="password" required />
            </div>
            <button type="submit" class="signin">Create</button>
            {#if form?.error}
                <p class="error">{form.error}</p>
            {/if}
        </form>
    {/if}
</div>

<style>
    
	.error {
		color: rgb(248, 131, 131);
	}

	.head {
		margin: 2rem 5rem 1rem 5rem;
		color: black;
	}

	.header {
		font-size: 2rem;
	}

	.question {
		font-size: 0.9rem;
		border: none;
		outline: none;
		background-color: transparent;
		color: rgb(88, 88, 88);
	}

	.question {
		cursor: pointer;
	}

	.signin {
		font-size: 1.2rem;
		margin-top: 1rem;
		padding: 1rem 2rem;
		background-color: var(--main-hover);
		border: 2px solid transparent;
		cursor: pointer;
		border-radius: 0.5rem;
		transition: all 0.25s;
	}

	.signin:hover {
		transition: all 0.25s;
		border: 2px solid yellow;
	}

	.login {
		background-color: var(--main);
		border-radius: 1rem;
        filter: drop-shadow(rgb(88, 88, 88) .2rem .2rem 1rem);
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
	}
</style>
