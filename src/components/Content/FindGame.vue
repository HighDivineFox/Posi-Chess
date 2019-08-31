<template>
    <div class="container">
        <div class="title">Games</div>
        <div class="flex-col">
            <FindBoard v-for="(game, index) in this.games" :key="index" :id="index" :boardConfig="game"/>
        </div>
    </div>
</template>

<script>
import { getOpenGames } from '../../../Server_Functions/game_repository'
import FindBoard from './FindBoard'

export default {
    components:{
        FindBoard
    },
    data: function() {
        return {
            games: null
        }
    },
    created(){
        getOpenGames()
            .then((result) => {
                this.games = result
            })        
    }
}
</script>

<style scoped>
    .container{
        padding: 20px;
        margin: 10px 2%;
        height: 100%;

        box-shadow: 1px 1px 3px black;
        border-radius: 0.2rem;

        text-align: center;

        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .flex-col{
        display: flex;
        flex-flow: column nowrap;
    }

    @media only screen and (max-width: 600px) {
        .wrapper{
            width: 80%;
        }
    }
</style>