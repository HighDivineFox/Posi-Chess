<template>
  <div class="wrapper">
      <div class="title" @mouseup="goHome">Posi-Chess</div>

      <div class="flex-row">
        <div>
            <img :src="require('../assets/gear.png')" />
        </div>

        <UserSettings v-if="user" :user="user" />
        <div v-else class="sign-in"><a href="./signup">SIGN IN</a></div>
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
        }
    }
}
</script>

<style scoped>
    .wrapper{
        height: 80px;
        width: 100%;

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

    @media only screen and (max-width: 600px) {
        .wrapper{
            padding: 0;
        }

        .title{
            font-size: 180%;
        }
    }
    
    .sign-in{
        padding: 10px;
    }

    .sign-in:hover{
        background-color: rgb(215, 250, 245);
        box-shadow: 1px 1px 3px black;
        border-radius: 0.3rem;
    }

    .flex-row{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        
        margin-right: 0px;
    }
</style>