<template>
  <section class="game flex-center">
        <div class="info p-1 m-4 inactive">
            <p>Song: </p>
            <p>Artist: </p>
            <p>Opening: </p>
        </div>
        <div class="middle">
            <div class="stats">
                <p>1/10</p>
                <p>Show Name</p>
                <p>0</p>
            </div>
            <video class="my-1" autoplay>
                <source v-if='songPlaying' src="../assets/openings/HigurashiGou.mp4">
                  Your browser does not support the video tag.
            </video>
            <form class="my-1" action="" @submit.prevent>
                <input type="text" class="guess-opening" placeholder="anime name">
            </form>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            songs: 10,
            songsCorrect: 0,
            songPlaying: true,
            songFinished: false,
            songTime: 20,
            userInput: ''
        }
    }
}
</script>