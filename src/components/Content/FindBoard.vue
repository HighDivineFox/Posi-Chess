<template>
    <div>
        <div>vs {{player}}</div>
        <div :id="'find-board' + this.id" class="board"></div>
    </div>
</template>

<script>
import '../../js/chessboard-1.0.0'
import '../../css/chessboard-1.0.0.css'

export default {
    data: function() {
        return {
            board: null,
            player: this.boardConfig.whitePlayer || this.boardConfig.blackPlayer
        }
    },
    props: {
        id: Number,
        boardConfig: Object
    },
    mounted(){
        this.board = Chessboard('find-board' + this.id, {
            position: this.boardConfig.FEN,
            orientation: this.boardConfig.whitePlayer != "" ? 'black' : 'white',
            showNotation: false,
        })
    }
}
</script>

<style scoped>
    .board{
        width: 150px;
        margin: 10px 0px;
    }
</style>