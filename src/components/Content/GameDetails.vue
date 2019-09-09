<template>
    <div class="wrapper" v-if="visible">
        
        <div>{{playerName}}</div>
        <div>{{game.whiteTime}} minutes</div>
        <div>{{game.pointAllowance}} points</div>

        <input v-if="!isUserGame" type="button" value="Join" @mouseup="handleJoinGame">
        <input v-if="isUserGame" type="button" value="Cancel" @mouseup="handleCancelGame">
        
    </div>
</template>

<script>
import { getUserByID } from '../../../Server_Functions/user_repository'
import { deleteGame, joinGame } from '../../../Server_Functions/game_repository'

export default {
    data: function() {
        return {
            playerName: "",
            visible: true
        }
    },
    props: {
        game: Object,
        user: Object
    },
    methods:{
        getPlayer(game){
            let id = ""
            if(game.whitePlayer) id = game.whitePlayer
            if(game.blackPlayer) id = game.blackPlayer

            getUserByID(id)
                .then((user) => {
                    this.playerName = user.username
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
                        this.visible = !this.visible
                    }else{
                        window.location.href = "../battleboard?gameid=" + game._id
                    }
                })
        },

        handleCancelGame(){
            this.visible = !this.visible
            deleteGame(this.game._id)
                .then((result) => {
                    if(result){
                        console.log("Game deleted");
                    }else{
                        console.log("Game not deleted");
                    }
                })
        }
    },
    mounted(){
        this.getPlayer(this.game)
    },
    computed:{
        isUserGame(){
            return this.user._id == this.game.whitePlayer || this.user._id == this.game.blackPlayer
        }
    }
}
</script>

<style scoped>
    .wrapper{
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 5px 0px;

        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .wrapper > div{
        margin: 10px;
        min-width: max-content;
        flex-grow: 2;
    }

    input{
        width: min-content;
    }

    .cancel{
        background-color: red;
        border: 1px solid black;
        border-radius: 50%;
        cursor: pointer;

        color: #FFF;
        padding: 5px;

        max-width: 15px;
        max-height: 15px;
    }
</style>