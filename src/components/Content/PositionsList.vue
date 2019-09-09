<template>
  <div class="container">
      <div class="title">Saved Positions</div>
      <div class="flex-col">
          <input type="button" value="New Position" @mouseup="loadPosMaker">
      </div>
      <SavedPositions :user="user" />
  </div>
</template>

<script>
import SavedPositions from './SavedPositions'
export default {
    components:{
        SavedPositions
    },
    props:{
        user: Object
    },
    methods:{
        loadPosMaker(){
            window.location.href = "./posmaker"
        }
    }
}
</script>

<style scoped>
    .container{
        padding: 10px;
        margin: 10px 2%;

        box-shadow: 1px 1px 3px black;
        border-radius: 0.2rem;

        text-align: center;
    
        display: flex;
        flex-flow: column nowrap;

        min-width: 300px;
        height: 100%;
    }

    .flex-col{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
</style>