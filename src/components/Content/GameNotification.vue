<template>
    <div class="Hwrapper">
        <div>{{game.whiteTime}} minutes</div>
        <div>{{game.pointAllowance}} points</div>

        <input type="button" value="Join" @mouseup="handleJoinGame">
    </div>
</template>

<script>
export default {
    props: {
        game: Object,
        user: Object
    },
    methods: {
        handleJoinGame(){
            window.location.href = "../battleboard?gameid=" + this.game._id
        }
    }
}
</script>

<style scoped>
    .Hwrapper{
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 5px 0px;

        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .Hwrapper > div{
        margin: 10px;
        min-width: max-content;
        flex-grow: 2;
    }
</style>