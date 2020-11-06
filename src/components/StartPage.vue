<template>
 <section class="start-screen flex-center">
        <h1 class="my-1">Anime Opening Quiz</h1>
        <button @click="this.$emit('toggle-play')" class="my-2">Play</button>
    </section>
</template>

<script>
export default {
    data() {
        return {
            hidden: true
        }
    }
}
</script>