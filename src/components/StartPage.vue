<template>
 <section class="start-screen flex-center">
        <h1 class="my-1">Anime Opening Quiz</h1>
        <button @click="this.$emit('toggle-play')" class="my-2">Play</button>
        <form name="contact" method="POST" data-netlify="true" data-netlify-recaptcha="true">
            <input v-show='!hidden' type="hidden" name="form-name" value="contact">
            <h3>Want to request an opening?</h3>
            <div class="form-control">
                <input type="text" name="anime" placeholder="anime name" required>
            </div>
            <div class="form-control">
                <input type="text" name="song" placeholder="song" required>
            </div>
            <div class="form-control">
                <input type="text" name="artist" placeholder="artist" required>
            </div>
            <div class="form-control">
                <input type="text" name="opening" placeholder="opening number" required>
            </div>
            <div class="form-control">
                <input type="text" name="artist" placeholder="link to mp4 file (use catbox.moe if possible)" required>
            </div>
            <input type="submit" value="Send" class="btn">
        </form>
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