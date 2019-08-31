<template>
  <div id="app">
    <Header />
    <Content />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'

export default {
  name: 'chess-app_V2',
  components: {
    Header,
    Content,
    Footer
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
