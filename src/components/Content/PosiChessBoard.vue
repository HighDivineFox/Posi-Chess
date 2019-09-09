<template>
    <div class="pointer" @mouseup="loadGamePage">
        <div>{{"vs " + (opponentName || "player")}}</div>
        <div :id="'cur-board' + id" class="board"></div>
    </div>
  
</template>

<script>
import '../../js/chessboard-1.0.0.js'
import '../../css/chessboard-1.0.0.css'

import { getGame } from '../../../Server_Functions/game_repository'
import { getUserByID } from '../../../Server_Functions/user_repository'

export default {
    data: function() {
        return{
            board: null,
            opponentName: null
        }
    },
    props:{
        id: Number,
        game: Object,
        userId: String
    },
    mounted(){
        getGame(this.game._id)
            .then((result) => {
                
                if(!result) {
                    console.log('no result');
                    return
                }

                this.board = Chessboard('cur-board' + this.id.toString(), {
                   position: result.FEN,
                   orientation: this.game.whitePlayer == this.userId ? 'white' : 'black',
                   showNotation: false
                })
            })

        let id = this.game.whitePlayer
        id = this.game.whitePlayer == this.userId ? this.game.blackPlayer : id

        getUserByID(id)
            .then((data) => {
                this.opponentName = data.username
            })
    },
    methods: {
        loadGamePage(){
            window.location.href = "../battleboard?gameid=" + this.game._id
        }
    }
}
</script>

<style scoped>
    .board{
        width: 200px;
        margin: 0 auto;
    }

    .pointer{
        cursor: pointer;
    }
</style>