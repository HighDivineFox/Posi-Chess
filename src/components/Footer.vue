<template>
  <div class="wrapper">
      <div class="contact">
          CONTACT
      </div>
      <div class="flex-row">
          <!-- TODO: REPLCE THE IMAGES OR ADD CREDIT TO PAGE -->
          <div class="flex-item"><a href="mailto:chris.3977@gmail.com"><img src="../assets/icons/envelope.png" /></a></div>
          <div class="flex-item"><a href="https://github.com/HighDivineFox" target="_blank" rel="noopener noreferrer"><img src="../assets/icons/github-logo.png" /></a></div>
          <div class="flex-item"><a href="https://www.linkedin.com/in/christopher-fox-4ba82726/" target="_blank" rel="noopener noreferrer"><img src="../assets/icons/linkedin-logo.png" /></a></div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .wrapper{
        height: 50px;
        padding: 10px;
    }

    .contact{
        width: max-content;
        padding: 10px 20px;
        margin: 0 auto;
        border-bottom: 1px solid black;
    }

    .flex-row{
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
    }
    
    .flex-item{
        padding: 10px;
    }

    .flex-item img{
        width: 30px;
    }
</style>