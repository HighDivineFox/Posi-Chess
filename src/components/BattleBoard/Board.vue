<template>
    <div class="flex-row">
        <div class="flex-col space-between panel">
            <div>
                <PieceCosts />
            </div>
            <div class="points" v-if="game">
                Point Allowance<br />
                {{game.pointAllowance - pointsSpent}}
            </div>
        </div>

        <div class="board-container">
            <div id="cover" class="cover-style">
                <div class="centre-text">
                    Opponent is preparing their board...

                    Cannot place pieces here
                </div>
            </div>
            <div id="board" class="board">Board</div>    
        </div>

        <div class="flex-col space-between panel">
            <div>
                <div class="timer">{{getOpponentTime()}}</div>
                <div>Opponent Name</div>
            </div>
            <div>
                <div v-if="user">{{user.username}}</div>
                <div class="timer">{{getPlayerTime()}}</div>
            </div>
        </div>

        <div class="dev-panel">
            <input type="button" value="Setup Phase">
            <input type="button" value="Game Phase">
        </div>
    </div>
</template>

<script>
import '../../js/chessboard-1.0.0'
import '../../css/chessboard-1.0.0.css'
import Chess from 'chess.js'

import { getGame } from '../../../Server_Functions/game_repository'

import PieceCosts from '../Content/PieceCosts'

export default {
    components:{
        PieceCosts
    },
    data: function() {
        return {
            chess: new Chess(),
            gamePhase: 'setup',
            gameID: "5d688d5e615e1c1f446ec6b2" || null,
            game: null,
            board: null,
            pointsSpent: 0,
            setupTime: 60 * 0.1,
            blackSetupPos: '4k3/8/8/8/8/8/8/8',
            whiteSetupPos: '8/8/8/8/8/8/8/4K3',
            whiteTime: null,
            blackTime: null,
            playerTurn: 'white'
        }
    },
    props:{
        user: Object
    },
    computed:{

        playerSide(){
            return this.game.whitePlayer == this.user._id ? 'white' : 'black'
        }
    },
    mounted(){
        this.enterSetupPhase()
    },
    methods:{

        enterSetupPhase(){
            let timerID = setInterval(() => {
            this.setupTime -= 1;

            if(this.setupTime <= 0) {
                clearInterval(timerID)
                this.enterGamePhase()
            }
        }, 1000)

        getGame(this.gameID)
            .then((result) => {
                this.game = result
                this.board = Chessboard('board', {
                    position: this.playerSide == 'white' ? this.whiteSetupPos : this.blackSetupPos,
                    sparePieces: true,
                    onDrop: this.onDrop,
                    orientation: this.game.whitePlayer == this.user._id ? 'white' : 'black'
                })

                this.whiteTime = result.whiteTime
                this.blackTime = result.blackTime

                document.getElementById('sparePiecesTop').style.display = 'none'
            })
        },

        enterGamePhase(){
            this.gamePhase = 'gameStart'

            this.whiteTime = this.game.whiteTime * 60
            this.blackTime = this.game.blackTime * 60

            document.getElementById('cover').style.display = 'none'
            document.getElementById('sparePiecesBot').style.display = 'none'
            
            let savePos = Chessboard.objToFen(this.board.position())

            this.board = Chessboard('board', {
                position: savePos,
                sparePieces: false,
                orientation: this.playerSide == 'white' ? 'white' : 'black',
                draggable: true
            })

            let timerID = setInterval(() => {
                if(this.playerTurn == 'white'){
                    this.whiteTime = this.whiteTime - 1 > 0 ? this.whiteTime - 1 : 0
                }else{
                    this.blackTime = this.blackTime - 1 > 0 ? this.blackTime - 1 : 0
                }

                if(this.gamePhase == 'ended'){
                    clearInterval(timerID)
                }
            }, 1000)

            //console.log(this.board.fen() + ' w KQkq - 0 1')
            console.log(this.chess.load(this.board.fen() + ' w KQkq - 0 1'))
            console.log(this.chess.fen())
            

            this.board.position(this.chess.fen())

            /*
            setInterval(() => {
                let moves = this.chess.moves()
                let move = moves[Math.floor(Math.random() * moves.length)]
                this.chess.move(move)

                this.board.position(this.chess.fen())
            }, 500)
            */
        },

        onDrop(source, target, piece, newPos, oldPos, orientation){
            //console.log("Source:", source)
            //console.log("Target:", target)
            
            if(this.board.orientation() == 'white'){
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

            if(this.calculatePoints(newPos) > this.game.pointAllowance) { this.calculatePoints(oldPos);  return 'snapback'}
            
            this.pointsSpent = this.calculatePoints(newPos)
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
            return this.pointsSpent = count
        },

        getPlayerTime(){
            if(this.gamePhase == 'setup'){
                let minutes = Math.floor((this.setupTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.setupTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }

            if(this.playerSide == 'white'){
                let  minutes = Math.floor((this.whiteTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.whiteTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }else{
                let  minutes = Math.floor((this.blackTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.blackTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }
        },

        getOpponentTime(){
            if(this.gamePhase == 'setup'){
                let minutes = Math.floor((this.setupTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.setupTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }

            if(this.playerSide == 'white'){
                let  minutes = Math.floor((this.blackTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.blackTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }else{
                let  minutes = Math.floor((this.whiteTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.whiteTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }
        }
    }
}
</script>

<style scoped>
    .flex-row{
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
    }

    .flex-row > div{
        margin: 10px;
    }

    .flex-col{
        display: flex;
        flex-flow: column nowrap;
    }
    
    .space-between{
        justify-content: space-between;
    }

    .flex-col > div{
        padding: 5px;
    }

    .board{
        width: 100%;
    }

    .panel{
        padding: 20px;
        margin: 10px 2%;

        box-shadow: 1px 1px 3px black;
        border-radius: 0.2rem;
        background-color: #f0f8ff;
    }

    .dev-panel{
        position: fixed;
        bottom: 0;
        width: 50%;

        padding: 20px;

        box-shadow: 1px 1px 3px black;
        border-radius: 0.2rem;
        background-color: #f0f8ff;
    }

    .board-container{
        position: relative;
        width: 40%;
        height: 100%;
    }

    .cover-style{
        z-index: 2;
        position: absolute;
        width: 100%;
        height: 44.2%;

        background-color: rgba(128, 128, 128, 0.5);
        border: 2px solid red;

        font-size: 200%;
        font-weight: bold;
        color: aliceblue;
        text-shadow: 0px 0px 2px black;
        text-align: center;

        box-sizing: border-box;
    }

    .centre-text{
        position: relative;
        top: 40%;
    }

    .timer{
        padding: 10px;
        margin: 5px 0px;
        background-color: gray;
        border-radius: 0.2rem;
        text-align: center;
        color: aliceblue;
        box-shadow: 1px 1px 2px black;

        font-size: 3vh;
    }

    .points{
        font-size: 200%;
        text-align: center;

        padding: 10px;
        margin: 5px 0px;
        background-color: gray;
        border-radius: 0.2rem;
        color: aliceblue;
        box-shadow: 1px 1px 2px black;
    }

    input{
        width: unset;
    }

    @media only screen and (max-width: 600px) {
        .board{
            width: 80%;
        }
    }
</style>