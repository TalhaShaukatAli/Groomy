<script>
    import paw from "$lib/static/paw.png"
    import SideBarNavMartketing from "$lib/components/SideBarNavMartketing.svelte";
    </script>
<div class="container">
	<SideBarNavMartketing />
    <div class="content">
        <slot />
    </div>
</div>

<style>

    
	.container {
		width: 100%;
		height: 100vh;
        display: grid;
        grid-template-columns: 200px 1fr;
	}

    

    .content {
        max-height: 100%;
        padding: 2rem;
        overflow-x: scroll;
    }
</style>
