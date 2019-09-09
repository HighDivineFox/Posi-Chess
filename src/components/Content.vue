<template>
  <div>
      <div v-if="user">
          <div class="wrapper">
            <FindGame :user="user" />
            <CurrentGames :userId="user._id" />
            <PositionsList :user="user" />
        </div>
      </div>

      <div v-else>
          <div class="wrapper">
              <Tutorial />
          </div>        
      </div>
  </div>
</template>

<script>
import CurrentGames from './Content/CurrentGames'
import PositionsList from './Content/PositionsList'
import Tutorial from './Content/Tutorial'
import FindGame from './Content/FindGame'

export default {
    components: {
        CurrentGames,
        PositionsList,
        Tutorial,
        FindGame
    },
    props: {
        user: Object
    }
}
</script>

<style scoped>
    .wrapper{
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
    }

    .wrapper > div{
        background-color: #f0f8ff;
    }
</style>