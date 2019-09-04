<template>
  <div id="app">
    <Header :user="user" />
    <div>
      <PosMaker :user="user" />
    </div>
    <Footer />
  </div>
</template>

<script>
import { getUserByID } from '../../../Server_Functions/user_repository'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PosMaker from '../../components/PosMaker'

export default {
  name: 'pos_maker',
  components: {
    Header,
    PosMaker,
    Footer
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 1rem;
}

*{
  margin: 0;
  padding: 0;
}

body{
  background-image: repeating-linear-gradient(180deg, #BDD 0%, #FFF 50%, #BDD 100%);
  height: 100vh;
}

input{
    padding: 5px 20px;
    font-size: 150%;
    margin: 10px;
    width: 90%;
    background-color: rgb(250, 235, 214);
    border-radius: 0.4em;
}

.title{
  font-size: 200%;
  padding: 0px 20px;
}
</style>
