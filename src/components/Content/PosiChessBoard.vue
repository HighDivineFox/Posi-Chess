<template>
    <div>
        <div>vs player</div>
        <div :id="'cur-board' + id" class="board"></div>
    </div>
  
</template>

<script>
import '../../js/chessboard-1.0.0.js'
import '../../css/chessboard-1.0.0.css'

import { getGame } from '../../../Server_Functions/game_repository'

export default {
    data: function() {
        return{
            board: null
        }
    },
    props:{
        id: Number,
        pos: String
    },
    mounted(){
        getGame(this.pos)
            .then((result) => {
                
                if(!result) {
                    console.log('no result');
                    return
                }

                this.board = Chessboard('cur-board' + this.id.toString(), {
                   position: result.FEN,
                   showNotation: false
                })
            })
    }
}
</script>

<style scoped>
    .board{
        width: 200px;
        margin: 0 auto;
    }
</style>