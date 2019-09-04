<template>
  <div class="wrapper">
      <div class="title" @mouseup="goHome">Posi-Chess</div>

      <div class="flex-row">
        <div>
            <img :src="require('../assets/gear.png')" />
        </div>

        <UserSettings v-if="user" :user="user" />
        <div v-else class="sign-in" @mouseup="loadSignUpPage"><a>SIGN IN</a></div>
      </div>
  </div>
</template>

<script>
import UserSettings from './Header/UserSettings'

export default {
    components:{
        UserSettings
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
</style>