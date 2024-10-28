<script lang="ts">
    import type { customerRecord } from "$lib/types";

    let {customers} : {customers: customerRecord[]} = $props()

    
    function DeleteByID(id: object){

    }


</script>

<div class="table">
    <div class="header">

    </div>
    <div class="rows">
        {#each customers as customer}
            {@render customerRow(customer)}
        {/each}
    </div>
</div>

{#snippet customerRow(data: customerRecord)}
    <div class="row">
        <div>
            {data.email}
        </div>
        <div>
            {data.phone}
        </div>
        <div>
            <a href="/home/customers/{data._id}">View</a>
            <a href="/home/customers/{data._id}/edit">Edit</a>
            <button onclick={()=>{DeleteByID(data._id)}}>Delete</button>
        </div>
    </div>
{/snippet}

<style>
    .table {
        width: 100%;
    }

    .header {
        min-height: 200px;
        padding: 1rem 2rem;
    }

    .rows {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .row {
        width: 100%;
        padding: 1rem 2rem;
        display: grid;
        grid-template-columns: 3fr 1fr 1fr;
        grid-template-rows: auto;
    }
</style>