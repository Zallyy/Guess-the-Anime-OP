<template>
  <section class="game flex-center">
        <div v-show="songLoop == 2" class="info p-1 m-4">
            <p>Song: {{currentSong.song}}</p>
            <p>Artist: {{currentSong.artist}}</p>
            <p>Opening: {{currentSong.opening}} </p>
        </div>
        <div class="middle">
            <div class="stats">
                <p>{{currentSongNum}}/10</p>
                <p v-show="songLoop == 2">{{currentSong.animeName}}</p>
                <p>{{songsCorrect}}</p>
            </div>
            <div class="video-container my-1">
                <video @loadeddata="newDataLoaded" :style="songPlaying ? 'background: none' : 'background: white'">
                <source v-if='songPlaying' :src="currentSong.link">
                  Your browser does not support the video tag.
                </video>
                <div v-show="playerIsGuessing" class="cover flex-center">
                    <p><strong>{{guessingTimeLeft}}</strong></p>
                </div>
            </div>
            
            <form class="my-1" action="" @submit.prevent>
                <input type="text" class="guess-opening" placeholder="anime name" autofocus>
            </form>
        </div>
    </section>
</template>

<script>
export default {
    props: [],
    data() {
        return {
            songList: [],
            animeList: [],
            songQueue: [],
            currentSong: {},
            songs: 10,
            currentSongNum: 0,
            songsCorrect: 0,
            songPlaying: false,
            songFinished: false,
            guessingTime: 20,
            intermissionTime: 20,
            songDuration: 0,
            songRandomStartTime: 0,
            songRandomEndTime: 0,
            songLoop: 1,
            playerIsGuessing: true,
            guessingTimeLeft: 20,
            userInput: ''
        }
    },
    mounted() {
        const fetchOpenings = async () => {
            const res = await fetch ('https://api.jsonbin.io/b/5fa3626047077d298f5d2872/6')
            this.songList = await res.json() 
            createAnimeList()
            this.chooseSong()
        }
        const createAnimeList = () => {
            this.songList.forEach(song => {
                if (!this.animeList.includes(song.animeName)) {
                    this.animeList.push(song.animeName)
                }
            })
            this.animeList.sort()
            console.log('Anime List', this.animeList)
        }
        fetchOpenings()
    },
    watch: {
        songLoop(value) {
            if (value >= 3) {
                this.songLoop = 1
                this.songPlaying = false
                this.chooseSong()
            }
            if (value == 2) {
                this.playOpening()
                this.playerIsGuessing = false
            }
        },
        currentSong() {
            const video = document.querySelector('video') 
            video.load()
        }
    },
    methods: {
        randomInt(min, max) { 
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        chooseSong() {
            // Testing
            // this.currentSong = this.songList[this.songList.length-1]; // Most recently added song. 
            this.songPlaying = true
            this.currentSongNum++

            //Comment out when testing new songs added
            let index = 0
            do {
                index = this.randomInt(0, this.songList.length-1)
                this.songQueue.push(index)
                this.currentSong = this.songList[index]  
            } while (!this.songQueue.includes(index))
        },
        playOpening() {
            this.guessingTimeLeft = this.guessingTime
            const video = document.querySelector('video') 
            video.currentTime = this.songRandomStartTime
            video.play()
            const tick = setInterval(() => {
                if (video.currentTime >= this.songRandomEndTime) {
                    clearInterval(tick)
                    video.pause()
                    this.playerIsGuessing = !this.playerIsGuessing 
                    this.songLoop++
                }
                this.guessingTimeLeft = this.songRandomEndTime - Math.floor(video.currentTime)
            }, 1000)
        },
        newDataLoaded() {
            this.getSongStats()
            this.playOpening()
        },
        getSongStats() {
            const video = document.querySelector('Video')
            this.songDuration = video.duration
            this.songRandomStartTime = this.randomInt(0, this.songDuration-22)
            this.songRandomEndTime = this.songRandomStartTime + this.guessingTime
        }
    }
}
</script>