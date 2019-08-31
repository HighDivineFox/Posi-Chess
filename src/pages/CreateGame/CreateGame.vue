<template>
    <div>
      <Header :user="user"/>
      <Create :user="user"/>
    </div>
</template>

<script>
import Create from '../../components/Content/Create'
import Header from '../../components/Header'

import { getUserByID } from '../../../Server_Functions/user_repository'

import VueCookies from 'vue-cookies'

export default {
  components:{
    Create,
    Header
  },
  data: function() {
    return {
      user: null
    }
  },
  created(){
    if(!window.$cookies.isKey('user')) return

    let id = window.$cookies.get('user')._id

    getUserByID(id)
      .then((res) => {
        if(res == null) return
      
        this.user = res
      })
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 1rem;
  }

  body{
    background-image: repeating-linear-gradient(180deg, #BDD 0%, #FFF 50%, #BDD 100%);
    height: 100vh;
  }

  a{
    text-decoration: none;
    color: rgb(62, 62, 255);
  }

  input{
      padding: 5px 20px;
      font-size: 150%;
      margin: 10px;
      width: 80%;
      background-color: rgb(250, 235, 214);
      border-radius: 0.4em;
  }

  .title{
    font-size: 200%;
    padding: 0px 20px;
  }
</style>