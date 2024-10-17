<style>
	.triangle-left {
		width: 0;
		height: 0;
		border-left: 100px solid transparent;
		border-top: 50px solid rgb(241, 161, 108);
	}

    .center {
        width: 200px;
        height: 50px;
        background-color: rgb(241, 161, 108);
    }

	.triangle-right {
		width: 0;
		height: 0;
		border-right: 100px solid transparent;
		border-top: 50px solid rgb(241, 161, 108);
	}

    .tab {
        display: flex;
        flex-direction: row;
        position: absolute;
        top: 0px;
    }
</style>

<div class="tab">
    <div class="triangle-left"></div>
    <div class="center"></div>
    <div class="triangle-right"></div>
</div>
