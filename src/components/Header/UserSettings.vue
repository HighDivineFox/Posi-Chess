<template>
  <div class="wrapper">
    <div @mouseup="changeDisplay">
        {{user.username}}
    </div>

    <div class="hidden" :style="{display: hideSettings}">
        <input class="sign-out" type="button" value="Sign Out" @mouseup="signOut">
    </div>
      
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'

export default {
    data: function() {
        return {
            hideSettings: "none"
        }
    },
    props:{
        user: Object
    },
    methods:{
        changeDisplay(){
            this.hideSettings = this.hideSettings == "none" ? "unset" : "none"
        },

        signOut(){
            window.$cookies.remove('user')
            window.location.href = "../"
        }
    }
}
</script>

<style scoped>
    .wrapper{
        position: relative;
        margin-right: 10px;
    }

    .hidden{
        position: absolute;
        right: 20%;
        top: 80%;

        padding: 10px 20px;

        background-color: #75e0db;
        border-radius: 0.3rem;
        box-shadow: 1px 1px 1px black;
    }

    .sign-out{
        background: none;
        border: none;
        border-radius: 0.3rem;        

        padding: 5px;

        font-size: 105%;
        color: rgb(36, 36, 36);
    }

    .sign-out:hover{
        color: #015EAB;
    }
</style>