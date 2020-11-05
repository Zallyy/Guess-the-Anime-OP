<template>
  <section class="game flex-center">
        <div v-show="songLoop == 2" class="info p-1 m-4">
            <p>Song: {{currentSong.song}}</p>
            <p>Artist: {{currentSong.artist}}</p>
            <p>Opening: {{currentSong.opening}} </p>
        </div>
        <div class="middle">
            <div class="stats">
                <p>{{currentSongNum}}/{{songs}}</p>
                <p v-show="songLoop == 2">{{currentSong.animeName}}</p>
                <p>{{songsCorrect}}</p>
            </div>
            <div :class="{correctAnswer}" class="video-container my-1">
                <video @loadeddata="newDataLoaded" :style="songPlaying ? 'background: none' : 'background: white'">
                <source v-if='songPlaying' :src="currentSong.link">
                  Your browser does not support the video tag.
                </video>
                <div v-show="playerIsGuessing" class="cover flex-center">
                    <p v-show="finishedLoading"><strong>{{guessingTimeLeft}}</strong></p>
                    <div v-show="!finishedLoading" class="loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            
            <form class="my-1 filterInput" action="" @submit.prevent>
                <input v-model='userInput' :class="{correctAnswer}" @focus="showList=true" @blur="showListFalse" type="text" class="guess-opening" placeholder="anime name" autofocus>
                <div v-if='showList'>
                    <div v-for="anime in animeList" :key="anime"> 
                        <p v-show="filterResults(anime)" @click='userInput = anime'>{{anime}}</p>
                    </div>
                </div>
            </form>

            <button v-if='gameFinished' @click="refreshPage" >Play Again</button>

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
            finishedLoading: false,
            songFinished: false,
            guessingTime: 20,
            songDuration: 0,
            songRandomStartTime: 0,
            songRandomEndTime: 0,
            songLoop: 1,
            playerIsGuessing: true,
            guessingTimeLeft: 20,
            userInput: '',
            correctAnswer: false,
            showList: false,
            gameFinished: false,
        }
    },
    mounted() {
        const fetchOpenings = async () => {
            const res = await fetch ('https://api.jsonbin.io/b/5fa3626047077d298f5d2872/7')
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
        }
        fetchOpenings()
    },
    watch: {
        songLoop(value) {
            if (!this.gameFinished) {
                this.correctAnswer = false
                if (value == 1) {
                    this.userInput = ''
                }
                if (value >= 3) {
                    this.finishedLoading = false
                    this.songLoop = 1
                    this.songPlaying = false
                    this.chooseSong()
                }
                if (value == 2) {
                    this.checkCorrectAnswer()
                    this.playOpening()
                    this.playerIsGuessing = false
                }
            }
        },
        currentSong() {
            const video = document.querySelector('video') 
            video.load()
        },
        currentSongNum(value) {
                if (this.songs < value) {
                this.gameFinished = true
            }
        },
    },
    methods: {
        refreshPage() {
            location.reload()
        },
        filterResults(anime) {
            if (anime.toLowerCase().includes(this.userInput.toLowerCase())) {
                return true
            } else {
                return false
            }
        },
        checkCorrectAnswer() {
            if (this.currentSong.animeName.toLowerCase() == this.userInput.toLowerCase()) {
                this.correctAnswer = true
                this.songsCorrect++
            }
        },
        showListFalse() {
            setTimeout(() => {
                this.showList = false
            },100)
        },
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
            this.finishedLoading = true
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