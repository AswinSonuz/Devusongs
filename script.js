const songs = [

    {
        title: "antha naalil",
        description: "Gopii Songs",
        audio: "music/song1.mp3",
        cover: "music/song1.png"
    },

    {
        title: "sun raha hai",
        description: "Gopii Songs",
        audio: "music/song2.mp3",
        cover: "music/song2.png"
    },

    {
        title: "mein agar kahoon",
        description: "Gopii Songs",
        audio: "music/song3.mp3",
        cover: "music/song3.png"
    },

    {
        title: "aararo aariraro",
        description: "Gopii Songs",
        audio: "music/song4.mp3",
        cover: "music/song4.png"
    },

    {
        title: "tharattu",
        description: "Gopii Songs",
        audio: "music/song5.mp3",
        cover: "music/song5.png"
    },

    {
        title: "koodappirannor",
        description: "Gopii Songs",
        audio: "music/song6.mp3",
        cover: "music/song6.png"
    },

    {
        title: "ennod nee irundhal",
        description: "Gopii Songs",
        audio: "music/song7.mp3",
        cover: "music/song7.png"
    },

    {
        title: "pesamale",
        description: "Gopii Songs",
        audio: "music/song8.mp3",
        cover: "music/song8.png"
    },

    {
        title: "madhu pole",
        description: "Gopii Songs",
        audio: "music/song9.mp3",
        cover: "music/song9.png"
    },

    {
        title: "chinna thayaval",
        description: "Gopii Songs",
        audio: "music/song10.mp3",
        cover: "music/song10.png"
    },

    {
        title: "meri aashiqui",
        description: "Gopii Songs",
        audio: "music/song11.mp3",
        cover: "music/song11.png"
    },

];


const audio = document.getElementById("audio");
audio.preload = "auto";
audio.playsInline = true;
audio.volume = 1;

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
let audioUnlocked = false;

function unlockAudioPlayback() {
    if (!audio) return Promise.resolve();

    audio.muted = false;
    audio.volume = 1;

    return audio.play()
        .then(() => {
            audioUnlocked = true;
        })
        .catch(() => {
            audioUnlocked = false;
            return Promise.resolve();
        });
}

function ensureAudioUnlocked() {
    if (audioUnlocked) return Promise.resolve();
    return unlockAudioPlayback();
}

['touchstart', 'touchend', 'pointerdown', 'click'].forEach((eventName) => {
    document.addEventListener(eventName, () => {
        if (!audioUnlocked) {
            audio.muted = false;
            audio.volume = 1;
            audio.play().catch(() => {});
        }
    }, { passive: true, once: true });
});

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

        ensureAudioUnlocked()
            .then(() => {
                return audio.play();
            })
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

    ensureAudioUnlocked()
        .then(() => {
            return audio.play();
        })
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

    ensureAudioUnlocked()
        .then(() => {
            return audio.play();
        })
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

    ensureAudioUnlocked()
        .then(() => {
            return audio.play();
        })
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

const backgroundToggle = document.getElementById("background-toggle");
const backgroundVideo = document.getElementById("background-video");

function getWindIconMarkup(showCross = false) {
    const cross = showCross ? `
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    ` : "";

    return `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 9.5h11.2a2.8 2.8 0 1 1-2.8 2.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 14.5h15.4a2.8 2.8 0 1 0-2.8-2.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14.4 4.8c1.7.6 2.7 1.8 3 3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M16.7 16.8c1.4.5 2.5 1.3 3.3 2.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            ${cross}
        </svg>
    `;
}

function renderBackgroundToggleIcon(showVideoMode) {
    backgroundToggle.innerHTML = getWindIconMarkup(!showVideoMode);
}

function restartBackgroundVideoSmoothly() {
    if (!backgroundVideo || !backgroundVideo.duration) {
        return;
    }

    const loopThreshold = 0.25;

    if (backgroundVideo.currentTime >= backgroundVideo.duration - loopThreshold) {
        backgroundVideo.currentTime = 0.05;
    }
}

backgroundVideo.addEventListener("timeupdate", restartBackgroundVideoSmoothly);

backgroundVideo.addEventListener("ended", () => {
    backgroundVideo.currentTime = 0;
    backgroundVideo.play().catch(() => {});
});

renderBackgroundToggleIcon(backgroundVideo.classList.contains("active"));

backgroundToggle.addEventListener("click", () => {

    if (backgroundVideo.classList.contains("active")) {

        // Switch back to image
        backgroundVideo.pause();
        backgroundVideo.classList.remove("active");
        renderBackgroundToggleIcon(false);

    } else {

        // Switch to video
        backgroundVideo.currentTime = 0;
        backgroundVideo.classList.add("active");
        backgroundVideo.play().catch(() => {});
        renderBackgroundToggleIcon(true);
    }
});