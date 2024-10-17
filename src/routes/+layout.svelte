<script>
    import paw from "$lib/static/paw.png"
    import SideBarNav from "$lib/components/SideBarNav.svelte";
    import TopTabBar from "$lib/components/TopTabBar.svelte";
</script>
<div class="container">
	<SideBarNav />
    <div class="content">
        <TopTabBar />
        
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
