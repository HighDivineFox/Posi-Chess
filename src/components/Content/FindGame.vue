<template>
    <div class="container">
        <div class="title">Games</div>
        <div class="flex-col">
            <GameDetails v-for="(game, index) in this.games" :key="index" :game="game" :user="user"/>
        </div>
    </div>
</template>

<script>
import { getOpenGames } from '../../../Server_Functions/game_repository'
import { getUserByID } from '../../../Server_Functions/user_repository'

import GameDetails from './GameDetails'

export default {
    components:{
        GameDetails
    },
    data: function() {
        return {
            games: null
        }
    },
    props: {
        user: Object
    },
    created(){
        getOpenGames()
            .then((result) => {
                this.games = result
            })
    },
    methods:{
        
        getPlayer(game){
            let id = ""
            if(game.whitePlayer) id = game.whitePlayer
            if(game.blackPlayer) id = game.blackPlayer

            getUserByID(id)
                .then((user) => {
                    return user.username
            })
        }
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