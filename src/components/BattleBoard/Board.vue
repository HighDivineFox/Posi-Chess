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
            <div id="board" class="board" @touchmove="prevent">Board</div>    
        </div>

        <div class="flex-col space-between panel">
            <div>
                <div class="timer">{{getOpponentTime()}}</div>
                <div>Opponent Name</div>
            </div>
            <div>
                <input type="button" value="Ready">
            </div>
            <div>
                <div v-if="user">{{user.username}}</div>
                <div class="timer">{{getPlayerTime()}}</div>
            </div>
        </div>
        <!--
        <div class="dev-panel">
            <input type="button" value="Setup Phase">
            <input type="button" value="Game Phase">
        </div>
        -->
    </div>
</template>

<script>
import '../../js/chessboard-1.0.0'
import '../../css/chessboard-1.0.0.css'
import Chess from 'chess.js'

import { getGame, updateStartPosInGame, updateFENInGame, getFENForGame, connectToGame, joinGame } from '../../../Server_Functions/game_repository'
import { addGameToHistory } from '../../../Server_Functions/user_repository'

import PieceCosts from '../Content/PieceCosts'

// TODO: Implement waiting for the opponent to join

export default {
    components:{
        PieceCosts
    },
    data: function() {
        return {
            chess: new Chess(),
            gamePhase: 'pre-game',
            gameID: null,
            game: null,
            board: null,
            pointsSpent: 0,
            setupTime: 60 * 0.2,
            blackSetupPos: '4k3/8/8/8/8/8/8/8',
            whiteSetupPos: '8/8/8/8/8/8/8/4K3',
            whiteTime: null,
            blackTime: null,
            cookieID: null
        }
    },
    props:{
        user: Object
    },
    created(){
        let ref = window.location.search
        //console.log(ref.match(/=(.*)/)[1])
        this.gameID = ref.match(/=(.*)/)[1]
    },
    mounted(){
        
        getGame(this.gameID)
            .then((result) => {
                this.game = result
                //console.log(window.$cookies.get('user'))
                this.handleJoinGame()
                
                this.cookieID = window.$cookies.get('user')._id

                this.board = Chessboard('board', {
                    position: result.whitePlayer == this.cookieID ? this.whiteSetupPos : this.blackSetupPos,
                    sparePieces: true,
                    onDrop: this.onDrop,
                    orientation: result.whitePlayer == this.cookieID ? 'white' : 'black'
                })

                this.whiteTime = result.whiteTime
                this.blackTime = result.blackTime

                document.getElementById('sparePiecesTop').style.display = 'none'
                this.connect()

            })        
    },
    methods:{

        connect(){
            let body = {id: this.gameID}
            if(this.game.whitePlayer == this.cookieID) body['whitePlayer'] = this.cookieID
            if(this.game.blackPlayer == this.cookieID) body['blackPlayer'] = this.cookieID

            console.log('connecting');
            

            connectToGame(body)
                .then((connected) => {                    
                    if(connected){                        
                        // Check if both players are connected
                        getGame(this.gameID)
                            .then((result) => {
                                console.log(result);
                                
                                if(result.whitePlayerConnected && result.blackPlayerConnected){
                                    console.log('both players connected!')
                                    addGameToHistory({user_Id: this.cookieID, game_Id:this.gameID})
                                        .then((result) => {
                                            //console.log(result)
                                            if(this.game.FEN != null){
                                                //this.gamePhase = "gamestart"
                                                this.enterGamePhase()
                                            }else{
                                                this.enterSetupPhase()
                                            }
                                            
                                        })
                                }else{
                                    setTimeout(() => {
                                        this.connect()
                                    }, 1000)
                                }
                            })
                    }
                })
        },

        prevent(e){
            e.preventDefault()
        },

        startPlayerCountDown(){
            let timerID = setInterval(() => {
                if(this.chess.turn() == 'w'){
                    this.whiteTime = this.whiteTime - 1 > 0 ? this.whiteTime - 1 : 0
                }else{
                    this.blackTime = this.blackTime - 1 > 0 ? this.blackTime - 1 : 0
                }

                if(this.whiteTime <= 0){
                    this.gamePhase = 'ended'
                    this.game.result = 'white'
                    this.game.ended = true
                    this.game.FEN = this.board.fen()
                    // Upload to database
                }else if(this.blackTime <= 0){
                    this.gamePhase = 'ended'
                    this.game.result = 'black'
                    this.game.ended = true
                    this.game.FEN = this.board.fen()
                    // Upload to database
                }

                if(this.gamePhase == 'ended'){
                    clearInterval(timerID)
                }
            }, 1000)
        },

        startSetupCountdown(){
            let timerID = setInterval(() => {
                this.setupTime -= 1;

                if(this.setupTime <= 0) {
                    clearInterval(timerID)
                    this.enterGamePhase()
                }
            }, 1000)
        },

        enterSetupPhase(){
            this.gamePhase = 'setup'
            this.startSetupCountdown()

            getGame(this.gameID)
                .then((result) => {
                    this.game = result
                    //console.log(window.$cookies.get('user'))
                    
                    let id = window.$cookies.get('user')._id

                    this.board = Chessboard('board', {
                        position: result.whitePlayer == id ? this.whiteSetupPos : this.blackSetupPos,
                        sparePieces: true,
                        onDrop: this.onDrop,
                        orientation: result.whitePlayer == id ? 'white' : 'black'
                    })

                    this.whiteTime = result.whiteTime
                    this.blackTime = result.blackTime

                    document.getElementById('sparePiecesTop').style.display = 'none'
                })
        },

        enterGamePhase(){
            this.gamePhase = 'gameStart'

            // Set Timers
            this.whiteTime = this.game.whiteTime * 60
            this.blackTime = this.game.blackTime * 60

            // Hide cover and spare pieces
            document.getElementById('cover').style.display = 'none'
            document.getElementById('sparePiecesBot').style.display = 'none'
            
            // Upload position to game in the database
            let body = {
                id: this.gameID,
                side: this.game.whitePlayer == this.user._id ? 'white' : 'black',
                pos: this.board.fen()
            }
            
            updateStartPosInGame(body)
                .then((data) => {
                    //console.log("Position updated:", data);

                    // Reset board so it doesn't restrict piece placement
                    // Apply chess logic
                    this.board = Chessboard('board', {
                        position: data.FEN,
                        sparePieces: false,
                        orientation: data.whitePlayer == this.user._id ? 'white' : 'black',
                        draggable: true,
                        onDragStart: this.dragStart,
                        onDrop: this.playerMove
                    })

                    this.startPlayerCountDown()

                    // Load combined FEN into chess logic
                    this.chess.load(data.FEN + ' w KQkq - 0 1')
                    
                    // Load FEN into board
                    this.board.position(this.chess.fen())
                    
                    // Let players play
                    this.checkForUpdate()

                    /*
                    setInterval(() => {
                        let moves = this.chess.moves()
                        let move = moves[Math.floor(Math.random() * moves.length)]
                        this.chess.move(move)

                        this.board.position(this.chess.fen())
                    }, 750)
                    */
                })
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

        dragStart(source, piece, pos, orientation){
            if(this.chess.turn() == 'w' && piece.match(/b/)) return false
            if(this.chess.turn() == 'b' && piece.match(/w/)) return false

            if(piece.match(/b/) && this.game.whitePlayer == this.user._id) return false
            if(piece.match(/w/) && this.game.blackPlayer == this.user._id) return false
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
            if(this.gamePhase == 'pre-game') return "00:00"

            if(this.gamePhase == 'setup'){
                let minutes = Math.floor((this.setupTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.setupTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }

            if(this.game.whitePlayer == this.user._id){
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
            if(this.gamePhase == 'pre-game') return "00:00"

            if(this.gamePhase == 'setup'){
                let minutes = Math.floor((this.setupTime / 60)).toString()
                if(minutes < 10) minutes = "0" + minutes

                let seconds = this.setupTime % 60
                if(seconds < 10) seconds = "0" + seconds

                return minutes + ":" + seconds
            }

            if(this.game.whitePlayer == this.user._id){
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
        },

        playerMove(source, target, piece, newPos,  oldPos, orientation){
            let validSquares = this.chess.moves({square: source})

            if(this.chess.move(`${source}${target}`, {sloppy: true}) != null){
                updateFENInGame({id: this.gameID, fen: this.chess.fen()})
                    .then((result) => {
                        if(!result){
                            console.log("Game wasn't able to update");
                        }
                    })
            }else{
                return 'snapback'
            }
        },

        checkForUpdate(){
            if(this.gamePhase != "gameStart") return

            getFENForGame(this.gameID)
                .then((data) => {
                    //console.log(data);
                    
                    this.chess.load(data)
                    this.board.position(this.chess.fen())
                })
                .finally(() => {
                    setTimeout(() => {
                        this.checkForUpdate()
                    }, 500)
                })
        },

        handleJoinGame(){
            //console.log("not implemented yet.", this.game._id);
            let body = {id: this.game._id}
            if(this.game.whitePlayer == '') body['whitePlayer'] = this.user._id
            if(this.game.blackPlayer == '') body['blackPlayer'] = this.user._id

            joinGame(body)
                .then((game) => {
                    if(!game){
                        alert("Game no longer exists");
                    }else{
                        window.location.href = "../battleboard?gameid=" + game._id
                    }
                })
        }
    }
}
</script>

<style scoped>
    .flex-row{
        display: flex;
        flex-flow: row wrap;
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
        .board-container{
            width: 100%;
        }

        .board{
            width: 100%;
        }
    }
</style>