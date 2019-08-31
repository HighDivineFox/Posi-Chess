<template>
<div class="container" v-if="visible">
    <div class="flex-row">
        <input type="button" value="Edit" @mouseup="editPos">
        <input type="button" value="Delete" @mouseup="deletePos">
    </div>
    
    <div :id="'pos-board' + id" class="board"></div>
</div>
  
</template>

<script>
import { deleteUserPosition } from '../../../Server_Functions/user_repository'
import '../../js/chessboard-1.0.0'
import '../../css/chessboard-1.0.0.css'

export default {
    data: function() {
        return{
            board: null,
            visible: true
        }
    },
    props:{
        id: Number,
        item: Object,
        userID: String
    },
    mounted(){
        this.board = Chessboard('pos-board' + this.id, {
            orientation: this.item.side == 'w' ? 'white' : 'black',
            position: this.item.pos,
            showNotation: true
        })
    },
    methods:{
        editPos(){
            window.location.href = './posmaker?ref=' + this.id
        },

        deletePos(){
            // Confirm deletion

            let data = {
                user_id: this.userID,
                pos_id: this.item._id
            }

            deleteUserPosition(data)
                .then((result) => {
                    if(result){
                        //console.log('Deleted successfully');
                        this.visible = false
                    }else{
                        console.log('Unable to delete');
                    }
                })
        }
    }
}
</script>

<style scoped>
    .board{
        margin: 10px;
        transform: translateY(-50%);
        clip-path: polygon(0% 50%, 101% 50%, 101% 100%, 0% 100%);
    }

    .container{
        padding: 10px 0px;
        border-bottom: 1px solid black;
        max-height: 210px;
    }

    .flex-row{
        display: flex;
        flex-flow: row nowrap;
    }
</style>