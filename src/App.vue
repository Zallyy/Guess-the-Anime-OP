<template>
<div class="body">
    <start-page v-if="!play" @toggle-play="togglePlay"></start-page>
    <opening-component v-if="play" @game-finished="togglePlay"></opening-component>
</div>
</template>

<script>

export default {
  data() {
    return {
      play: false
    } 
  },
  methods: {
    togglePlay() {
      this.play = !this.play
    }
  }
}
</script>
