<template>
  <div class="wrapper">
      <div class="title" @mouseup="goHome">Posi-Chess</div>

      <div class="flex-row">
        <div class="settings-container">
            <div class="notification" v-if="notifications.length > 0">&nbsp;</div>
            <img :src="require('../assets/gear.png')" /> <!-- TODO: Consider changing this to a bell icon -->
        </div>

        <UserSettings v-if="user" :user="user" />
        <div v-else class="sign-in" @mouseup="loadSignUpPage"><a>SIGN IN</a></div>
      </div>
  </div>
</template>

<script>
import UserSettings from './Header/UserSettings'
import { getGameWithPlayerID } from '../../Server_Functions/game_repository'

export default {
    components:{
        UserSettings
    },
    data: function() {
        return {
            initialGames: null,
            notifications: []
        }
    },
    props: {
        user: Object
    },
    methods:{
        goHome(){
            window.location.href = window.location.origin
        },

        loadSignUpPage(){
            window.location.href = "./signup"
        },

        checkForChanges(){
            getGameWithPlayerID(this.user._id)
                .then((games) => {
                    for(var i = 0; i < this.initialGames.length; i++){
                        let game = games.find((item) => { return item._id == this.initialGames[i]._id})

                        if(!game) return
                    
                        if(game.whitePlayer != this.initialGames[i].whitePlayer || game.blackPlayer != this.initialGames[i].blackPlayer){
                            // TODO: Don't redirect immediately. Need to show a notification and join from there
                            this.notifications.push({game})
                            //window.location.href = "./battleboard?gameid=" + game._id
                        }

                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        this.checkForChanges()
                    }, 1000)
                })
        }
    },
    watch:{
        user(){
            getGameWithPlayerID(this.user._id)
                .then((games) => {
                    this.initialGames = games
                })
                .finally(() => {
                    this.checkForChanges()
                })
        }
    }
}
</script>

<style scoped>
    .wrapper{
        height: 80px;
        max-width: 90%;
        margin: 0 auto;

        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .title{
        cursor: pointer;
        font-size: 250%;
        font-weight: bold;

        margin-left: 0%;
        color: aliceblue;
        text-shadow: 1px 1px 2px black;

        min-width: max-content;
    }

    .sign-in{
        padding: 10px;
        cursor: pointer;
    }

    .sign-in:hover{
        background-color: rgb(215, 250, 245);
        box-shadow: 1px 1px 3px black;
        border-radius: 0.3rem;
    }

    .flex-row{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;

        height: 60%;
        min-width: 150px;
        padding: 5px 10px;
        
        background-color: rgb(215, 250, 245);
        box-shadow: 1px 1px 3px black;
        border-radius: 0.3rem;
    }

    @media only screen and (max-width: 600px) {
        .wrapper{
            padding: 0;
            max-width: 100%;
        }

        .title{
            font-size: 5vh;
            flex-shrink: 2;
        }

        .flex-row{
            min-width: 150px;
            margin: 0 auto;
        }
    }

    .notification{
        background-color: red;
        border-radius: 50%;
        position: absolute;
        top: -15%;
        right: -5%;
        width: 12px;
        height: 12px;
    }

    .settings-container{
        position: relative;
    }
</style>