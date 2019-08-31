<template>
  <div class="wrapper">
    <PosBoard v-for="(item, index) in  this.user.savedPositions" :key="index" :id="index" :item="item" :userID="user._id"/>
  </div>
</template>

<script>
import { getWhitePos } from '../../../Server_Functions/user_repository'

import PosBoard from './PosBoard'

export default {
  components:{
    PosBoard
  },
  props: {
    user: Object
  }
}
</script>

<style scoped>
  .wrapper{
        padding: 10px;
        margin: 10px 2%;
        text-align: center;

        margin: 0 auto;
        width: 90%;

        display: flex;
        flex-flow: column nowrap;
    }
</style>