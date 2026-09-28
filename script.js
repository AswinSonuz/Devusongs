const songs = [

    {
        title: "Kulusugal",
        description: "Gopii Songs",
        audio: "music/song1.mp3",
        cover: "music/song1.png"
    },

    {
        title: "Apni Karim",
        description: "Gopii Songs",
        audio: "music/song2.mp3",
        cover: "music/song2.png"
    },

    {
        title: "Meh Agar Kahu",
        description: "Gopii Songs",
        audio: "music/song3.mp3",
        cover: "music/song3.png"
    },

    {
        title: "Arrari Arriraro",
        description: "Gopii Songs",
        audio: "music/song4.mp3",
        cover: "music/song4.png"
    }

];


const audio = document.getElementById("audio");

const albumCover = document.getElementById("album-cover");
const songTitle = document.getElementById("song-title");
const songDescription = document.getElementById("song-description");

const playButton = document.getElementById("play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const progress = document.getElementById("progress");

const currentTimeDisplay =
    document.getElementById("current-time");

const durationDisplay =
    document.getElementById("duration");


let currentSong = 0;


/* =========================
   FORMAT TIME
========================= */

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secondsRemaining =
        Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secondsRemaining}`;
}


/* =========================
   LOAD SONG
========================= */

function loadSong(index) {

    const song = songs[index];

    // Change music
    audio.src = song.audio;

    // Force browser to load new song
    audio.load();

    // Change album cover
    albumCover.src = song.cover;

    // Change title
    songTitle.textContent = song.title;

    // Change description
    songDescription.textContent = song.description;

    // Reset timeline
    progress.value = 0;

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    // Reset play button
    playButton.innerHTML = '<i data-lucide="play"></i>';
    lucide.createIcons();
}


/* =========================
   PLAY / PAUSE
========================= */

playButton.addEventListener("click", () => {

    if (audio.paused) {

        audio.play()
            .then(() => {
                playButton.innerHTML = '<i data-lucide="pause"></i>';
                lucide.createIcons();
            })
            .catch(error => {
                console.error("Could not play audio:", error);
            });

    } else {

        audio.pause();

        playButton.innerHTML = '<i data-lucide="play"></i>';
        lucide.createIcons();
    }

});


/* =========================
   NEXT SONG
========================= */

nextButton.addEventListener("click", () => {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);

    audio.play()
        .then(() => {
            playButton.innerHTML = '<i data-lucide="pause"></i>';
            lucide.createIcons();
        })
        .catch(error => {
            console.error("Could not play audio:", error);
        });

});


/* =========================
   PREVIOUS SONG
========================= */

previousButton.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);

    audio.play()
        .then(() => {
            playButton.innerHTML = '<i data-lucide="pause"></i>';
            lucide.createIcons();
        })
        .catch(error => {
            console.error("Could not play audio:", error);
        });

});


/* =========================
   SONG ENDED
========================= */

audio.addEventListener("ended", () => {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);

    audio.play()
        .then(() => {
            playButton.innerHTML = '<i data-lucide="pause"></i>';
            lucide.createIcons();
        });

});


/* =========================
   SONG DURATION
========================= */

audio.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent =
        formatTime(audio.duration);

});


/* =========================
   UPDATE TIMELINE
========================= */

audio.addEventListener("timeupdate", () => {

    const current = audio.currentTime;
    const total = audio.duration;

    if (!isNaN(total) && total > 0) {

        const percentage =
            (current / total) * 100;

        progress.value = percentage;

        currentTimeDisplay.textContent =
            formatTime(current);

        durationDisplay.textContent =
            formatTime(total);
    }

});


/* =========================
   SEEK THROUGH SONG
========================= */

progress.addEventListener("input", () => {

    if (!isNaN(audio.duration) && audio.duration > 0) {

        audio.currentTime =
            (progress.value / 100) *
            audio.duration;
    }

});


/* =========================
   LOAD FIRST SONG
========================= */

loadSong(currentSong);