<template>
<div class="container">
    <div class="options">
        <div>
            <div class="title">Points Left to Spend</div>
            <div class="title">{{pointsLeft - pointsSpent}}</div>
        </div>
        
        <div>
            <input type="button" value="Change Orientation" @mouseup="changeOrientation">
        </div>
    </div>

    <div class="board-wrapper">
        <div id="cover" class="cover-style">Cannot place pieces here</div>
        <div id="board" class="board-style" @touchmove="prevent"></div>
        <div><input type="button" value="Save Position" @mouseup="savePos"></div>
        <div v-if="!canSave" class="error">You've spent too many points</div>
    </div>

    <PieceCosts :board="board"/>
</div>
  
</template>

<script>
import { insertNewUserPosition, updateExistingPosition } from '../../Server_Functions/user_repository'
import '../js/chessboard-1.0.0'
import '../css/chessboard-1.0.0.css'

import PieceCosts from './Content/PieceCosts'

export default {
    components:{
        PieceCosts
    },
    data: function() {
        return {
            pointsLeft: this.points || 15,
            pointsSpent: 0,
            board: null,
            boardEle: null,
            cover: null,
            whiteStartFEN: "8/8/8/8/8/8/8/4K3",
            blackStartFEN: "4k3/8/8/8/8/8/8/8",
            orientation: 'white',
            PosId: null
        }
    },
    props:{
        user: Object,
        points: Number
    },
    mounted(){
        this.loadBoard()

        this.cover = document.getElementById('cover')
        this.boardEle = document.getElementById('board')
        
        //console.log(this.boardEle);

        this.cover.style.width = this.boardEle.clientWidth + 'px'
        this.cover.style.height = this.boardEle.clientHeight/2.26 + 'px'
    },
    methods:{

        loadBoard(){            
            this.board = Chessboard('board', {
                position: this.orientation == 'white' ? this.whiteStartFEN : this.blackStartFEN,
                orientation: this.orientation,
                showNotation: false,
                sparePieces: true,
                onDrop: this.onDrop
            })

            document.getElementById('sparePiecesTop').style.display = 'none'
        },

        onDrop(source, target, piece, newPos, oldPos, orientation){
            //console.log("Source:", source)
            //console.log("Target:", target)
            
            if(this.orientation == 'white'){
                // If the piece is a king and the target is offboard - snapback
                if(piece.match(/wK/) && target == 'offboard') { this.calculatePoints(oldPos); return 'snapback'}

                // If the piece is not a king and the target is offboard - trash
                if(!piece.match(/wK/) && target == 'offboard') { this.calculatePoints(newPos); return 'trash'}

                // If the piece's target is in the opponents area - snapback
                if(target.match(/\d/)[0] >= 5) { this.calculatePoints(oldPos); return 'snapback'}
            }else{                
                // If the piece is a king and the target is offboard - snapback
                if(piece.match(/bK/) && target == 'offboard') { this.calculatePoints(oldPos);  return 'snapback'}

                // If the piece is not a king and the target is offboard - trash
                if(!piece.match(/bK/) && target == 'offboard') { this.calculatePoints(newPos); return 'trash'}

                // If the piece's target is in the opponents area - snapback
                if(target.match(/\d/)[0] <= 4) { this.calculatePoints(oldPos); return 'snapback'}
            }

            // Ensure the player can't replace the king
            if(!Chessboard.objToFen(newPos).match(/K/) && !Chessboard.objToFen(newPos).match(/k/)){
                return 'snapback'
            }
            
            this.calculatePoints(newPos)
        },

        calculatePoints(newPos){
            let fen = String(Chessboard.objToFen(newPos))
            //console.log(fen);

            let piecesToCount = [
                {
                    piece: 'P',
                    value: 1,
                    count: 0
                },
                {
                    piece: 'B',
                    value: 3,
                    count: 0
                },
                {
                    piece: 'N',
                    value: 3,
                    count: 0
                },
                {
                    piece: 'R',
                    value: 5,
                    count: 0
                },
                {
                    piece: 'Q',
                    value: 8,
                    count: 0
                }
            ]
            if(this.board.orientation() == 'black'){
                piecesToCount = piecesToCount.map((item) => {
                    return {
                        piece: item.piece.toLowerCase(),
                        value: item.value,
                        count: item.count
                    }
                })
            }

            for(var i = 0; i < piecesToCount.length; i++){
                let reg = new RegExp(piecesToCount[i].piece, 'g')

                if(fen.match(reg) != null){
                    piecesToCount[i].count = fen.match(reg).length
                }
            }

            let count = 0
            piecesToCount.forEach((item) => {count += Number(item.value * item.count)})
            this.pointsSpent = count
        },

        savePos(){
            if(!this.canSave) return

            let data = {
                user_id: this.user._id,
                side: this.orientation == 'white' ? 'w' : 'b',
                pos: this.board.fen(),
                points: this.pointsSpent
            }

            // Update if position ID already exists
            if(this.PosId){
                data['pos_id'] = this.user.savedPositions[Number(this.PosId)]._id
                                
                updateExistingPosition(data)
                    .then((result) => {
                        if(result){
                            console.log('position updated succesfully')
                            window.location.href = '../'
                        }else{
                            console.log('Unable to update position')
                        }
                    })
            // Else add to the savedPositions array
            }else{                
                insertNewUserPosition(data)
                    .then((result) => {
                        if(!result){
                            console.log('User was not able to update')
                        }else{
                            window.location.href = '../'
                        }
                    })
            }

        },

        changeOrientation(){
            this.orientation = this.orientation == 'white' ? 'black' : 'white'

            this.board.orientation(this.orientation == 'white' ? 'white' : 'black')
            this.board.position(this.orientation == 'white' ? this.whiteStartFEN : this.blackStartFEN)

            this.calculatePoints()
        },

        prevent(e){
            e.preventDefault()
        }
    },
    watch:{
        user(){
            let urlParams = window.location.search

            if(!urlParams) return

            this.PosId = window.location.search.match(/\d/)[0]

            if(this.PosId){
                this.orientation = this.user.savedPositions[this.PosId].side == 'w' ? 'white' : 'black'

                this.board.orientation(this.user.savedPositions[this.PosId].side == 'w' ? 'white' : 'black')                
                this.board.position(this.user.savedPositions[this.PosId].pos)
            }
        }
    },
    computed:{
        canSave(){
            return this.pointsLeft - this.pointsSpent >= 0
        }
    }
}
</script>

<style scoped>
    .board-wrapper{
        position: relative;
        width: 40%;
        max-width: 500px;
        height: 100%;
    }

    .cover-style{
        z-index: 2;
        position: absolute;
        width: 100%;
        height: 44.4%;

        background-color: rgba(128, 128, 128, 0.5);
        border: 2px solid red;

        font-size: 200%;
        font-weight: bold;
        color: aliceblue;
        text-shadow: 0px 0px 2px black;
        text-align: center;

        box-sizing: border-box;
    }

    .board-style{
        width: 100%;
    }

    @media only screen and (max-width: 600px) {
        .board-wrapper{
            width: 80vw;
        }

        .board-style{
            width: 90%;
        }

        .cover-style{
            left: 8%;
            top: 3%;
        }
    }

    .options{
        height: 150px;

        background-color: #f0f8ff;
        padding: 10px;
        text-align: center;
        border-radius: 1em;
        box-shadow: 1px 1px 1px 1px black;
    }
    
    .container{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;

        position: relative;

        width: 100%;
        height: 100%;
    }

    .error{
        background-color: rgb(255, 110, 110);
        
        padding: 10px;

        width: 80%;
        margin: 5px auto;
        font-size: 110%;
        color: rgb(27, 27, 27);

        box-shadow: 1px 1px 2px rgb(32, 32, 32);
        border-radius: 0.4rem;
    }
</style>