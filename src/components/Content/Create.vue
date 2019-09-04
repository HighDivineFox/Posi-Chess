<template>
    <div class="settings">
        <div class="title">Create</div>

        <div class="spacer">
            <div class="subtitle">Point allowance</div>
            <select name="points" id="points" v-model="pointAllow">
                <option v-for="n in 5" :value="n * 5" :key="n">{{n * 5}}</option>
            </select>
        </div>

        <div class="spacer">
            <div class="title">Time Control</div>
            <div class="subtitle">Minutes per side: {{minutes}}</div>
            <input class="range-style" type="range" name="time" id="time" min="5" max="60" step="1" value="10" v-model="minutes">
        </div>

        <div v-if="!searching">
            <input type="button" value="Search" @mouseup="startSearching">
        </div>

        <div v-if="searching">
            <div class="title">Searching...</div>
            <div>
                <input type="button" value="Cancel" @mouseup="stopSearching">
            </div>
        </div>
    <!--
        <div class="spacer">
            <div class="title">Select a side</div>
            <div class="flex-row around">
                <div class="flex-col">
                    <div>As white</div>
                    <div class="up-arrow">&nbsp;</div>
                    <div id="whiteBoard">White</div>
                    <div class="down-arrow">&nbsp;</div>
                </div>
                
                <div class="flex-col">
                    <div>As black</div>
                    <div class="up-arrow">&nbsp;</div>
                    <div id="blackBoard" class="grow">Black</div>
                    <div class="down-arrow">&nbsp;</div>
                </div>
            </div>
        </div>
    -->

        
    </div>
</template>

<script>
import '../../js/chessboard-1.0.0'
import '../../css/chessboard-1.0.0.css'

import { postGame, getGameWithPlayerID, getOpenGames, joinGame } from '../../../Server_Functions/game_repository'

export default {
    data: function() {
        return {
            minutes: 5,
            pointAllow: 15,
            searching: false,
            intervalID: null
        }
    },
    props:{
        user: Object
    },
    methods:{
        startSearching(){
            this.searching = true;

            // Look for a game
            getOpenGames()
                .then((games) => {
                    // If game not found, create a game
                    if(games.length == 0){ // No games found
                        let body = {}
                        if(Math.random() > 0.5){
                            body['whitePlayer'] = this.user._id
                            body['blackPlayer'] = ""
                        }else{
                            body['whitePlayer'] = ""
                            body['blackPlayer'] = this.user._id
                        }
                        body['points'] = this.pointAllow
                        body['minutes'] = this.minutes
                        
                        // Create game
                        postGame(body)
                            .then((res) => {
                                this.intervalID = setInterval(() => {this.getGame()}, 1000)
                            }).finally(() => {
                                return
                            })
                    }

                    for(var i = 0; i < games.length; i++){
                        if((games[i].whitePlayer != this.user._id && games[i].whitePlayer != '')){
                            if(games[i].pointAllowance != this.pointAllow || games[i].whiteTime != this.minutes) continue

                            let body = {
                                id: games[i]._id,
                                blackPlayer: this.user._id
                            }
                            joinGame(body)
                                .then((game) => {
                                    window.location.href = "../battleboard?gameid=" + game._id
                                })
                            
                        }else if(games[i].blackPlayer != this.user._id && games[i].blackPlayer != ''){
                            if(games[i].pointAllowance != this.pointAllow || games[i].whiteTime != this.minutes) continue

                            let body = {
                                id: games[i]._id,
                                whitePlayer: this.user._id
                            }
                            joinGame(body)
                                .then((game) => {
                                    window.location.href = "../battleboard?gameid=" + game._id
                                })
                        } 
                    }

                    
                })
        },

        stopSearching: function(event){
            this.searching = false;
            if(this.intervalID) clearInterval(this.intervalID)
        },

        getGame(){
            getGameWithPlayerID(this.user._id)
                .then((games) => {                    
                    for(var i = 0; i < games.length; i++){
                        // If a game has both players and one of them is the user
                        if((games[i].whitePlayer != '' && games[i].blackPlayer != '') && (games[i].blackPlayer == this.user._id || games[i].whitePlayer == this.user._id)){
                            window.location.href = "../battleboard?gameid=" + games[i]._id
                            break
                        }
                    }
                })
        }
    }
}
</script>

<style scoped>

    .settings{
        position: relative;
        margin: 10px auto;
        text-align: center;

        background-color: #f0f8ff;
        width: 50%;
        padding: 1%;

        box-shadow: 1px 1px 5px rgb(32, 32, 32);
        border-radius: 0.4rem;
        
    }

    .subtitle{
        font-size: 150%;
        padding: 5px;
    }

    select{
        padding: 10px 0px;
        text-align: center;
        width: 50%;

        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-image: url('../../assets/icons/select_down_arrow.png'), linear-gradient(180deg, rgb(222, 250, 255), rgb(201, 245, 253));
        background-repeat: no-repeat, repeat;
        background-position: right .2rem top 50%, 0 0;

        font-size: 150%;

        border: 1px solid rgb(73, 73, 73);
        border-radius: 1rem;
        cursor: pointer;
    }

    .spacer{
        margin: 20px 0px;
    }

    .range-style{
        width: 50%;
        padding: 0;
        cursor: pointer;
    }

    .range-style::-moz-range-track{
        color: black
    }

    .flex-row{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .flex-col{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        min-height: 150px;
    }

    .around{
        justify-content: space-around;
    }

    .grow{
        flex-grow: 5;
    }

    .around > div{
        width: 100%;
        margin: 10px;
        padding: 0px 10px;
    }

    @media only screen and (max-width: 600px) {
        .wrapper{
            width: 100vw;
        }

        .settings{
            width: 80%;
            padding: 0;
        }
    }

    #whiteBoard{
        min-width: 100%
    }

    #blackBoard{
        min-width: 100%
    }

    .up-arrow{
        min-width: 32px;
        min-height: 20px;
        background-image: url('../../assets/icons/up_arrow.png');
    }

    .down-arrow{
        min-width: 32px;
        min-height: 20px;
        background-image: url('../../assets/icons/down_arrow.png');
    }
</style>