<template>
  <div id="app">
    <LogIn />
  </div>
</template>

<script>
import LogIn from '../../components/LogIn'

export default {
  name: 'sign_up',
  components: {
    LogIn
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
  box-sizing: border-box;
}

body{
  background-image: repeating-linear-gradient(180deg, #BDD 0%, #FFF 50%, #BDD 100%);
  height: 100vh;
}
</style>
