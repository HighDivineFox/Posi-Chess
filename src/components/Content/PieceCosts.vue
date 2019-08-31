<template>
    <div class="wrapper">
        <div class="title">Piece costs</div>

        <div class="flex-col">
            <div v-for="(piece, index) in whitePiece" :key="index" class="piece-style">
                <img :src="piece.img">
                <div class="points">{{piece.value}}</div>
                <img :src="blackPiece[index].img">
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            whitePiece: [
                {value: 1, img: './img/chesspieces/wikipedia/wp.png'},
                {value: 3, img: './img/chesspieces/wikipedia/wb.png'},
                {value: 3, img: './img/chesspieces/wikipedia/wn.png'},
                {value: 5, img: './img/chesspieces/wikipedia/wr.png'},
                {value: 8, img: './img/chesspieces/wikipedia/wq.png'}
            ],
            blackPiece: [
                {value: 1, img: './img/chesspieces/wikipedia/bp.png'},
                {value: 3, img: './img/chesspieces/wikipedia/bb.png'},
                {value: 3, img: './img/chesspieces/wikipedia/bn.png'},
                {value: 5, img: './img/chesspieces/wikipedia/br.png'},
                {value: 8, img: './img/chesspieces/wikipedia/bq.png'}
            ]
        }
    }
}
</script>

<style scoped>
    .wrapper{
        background-color: #f0f8ff;
        padding: 10px;
        text-align: center;
        border-radius: 1em;
        box-shadow: 1px 1px 1px 1px black;
    }

    .title{
        border-bottom: 1px solid black;
    }

    .piece-style{
        padding: 10px;

        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .piece-style > *{
        display: inline-block;
        padding: 0px 3px;
    }

    .flex-col{
        display: flex;
        flex-flow: column nowrap;
    }

    .points{
        font-size: 200%;
        font-weight: bold;
        color: rgb(0, 132, 255);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
        
    }
</style>