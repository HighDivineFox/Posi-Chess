<template>
  <div class="container">
      <div class="title">Your Games</div>
      <input type="button" value="Create Game" @mouseup="createGame">
      <PosiChessBoard class="board" v-for="(pos, index) in  activeGames" :key="index" :id="index" :pos="pos" />
  </div>
</template>

<script>
import PosiChessBoard from './PosiChessBoard'

export default {
    data: function() {
        return {
            showCreateDialog: false
        }
    },
    props:{
        activeGames: Array
    },
    components:{
        PosiChessBoard,
    },
    methods:{
        createGame(){
            window.location.href = './creategame'
        }
    }
}
</script>

<style scoped>
    .container{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        padding: 10px;
        margin: 10px 2%;

        height: 100%;

        box-shadow: 1px 1px 3px black;
        border-radius: 0.2rem;
        text-align: center;
    }

    @media only screen and (max-width: 600px) {
        .container{
            width: 80%
        }
    }

    .board{
        margin: 10px;
    }
    
</style>