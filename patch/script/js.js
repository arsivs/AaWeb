let player, ytReady = false;

window.onload = () => {

};

function button_yt(id){
  document.querySelector(".poster-card.active")?.classList.remove("active");
  yt.init(id);
  document.querySelector("#"+id).classList.add("active");
}

function startVoice() {
  const r = new webkitSpeechRecognition();
  r.lang = "tr-TR";
  r.onresult = e => document.querySelector("#text").value =
    e.results[0][0].transcript;
  r.start();
}


function onYouTubeIframeAPIReady() {
    ytReady = true;
}


let videoStartTime = 0;
let videoWaiting = false;

function videoStateChanged(event) {
    if (event.data === YT.PlayerState.PLAYING && videoWaiting) {
        const ms = performance.now() - videoStartTime;

        console.log(`[AutoX-YT] Video açılma süresi: ${ms.toFixed(0)} ms`);

        videoWaiting = false;
    }
}

let videoStartTime = 0;
let videoWaiting = false;

function videoStateChanged(event) {
    const states = {
        [-1]: 'UNSTARTED',
        [0]: 'ENDED',
        [1]: 'PLAYING',
        [2]: 'PAUSED',
        [3]: 'BUFFERING',
        [5]: 'CUED'
    };

    const ms = performance.now() - videoStartTime;

    console.log(
        `[AutoX-YT] ${states[event.data] ?? event.data}: ${ms.toFixed(0)} ms`
    );

    if (event.data === YT.PlayerState.PLAYING && videoWaiting) {
        console.log(`[AutoX-YT] Video açılma süresi: ${ms.toFixed(0)} ms`);
        videoWaiting = false;
    }
}
const yt = {
    init(id) {
        if (!ytReady) {
            return console.warn('YouTube API henüz hazır değil');
        }

        videoStartTime = performance.now();
        videoWaiting = true;

        console.log(`[AutoX-YT] Video yükleniyor: ${id}`);

        if (player) {
            return player.loadVideoById(id);
        }

        player = new YT.Player('player', {
            width: '100%',
            height: '100%',
            videoId: id,
            playerVars: {
                playsinline: 1,
                autoplay: 1
            },
            events: {
                onStateChange: videoStateChanged
            }
        });
    },

    toggle: () => {
        if (!player) return;
        player.getPlayerState() === YT.PlayerState.PLAYING
            ? player.pauseVideo()
            : player.playVideo();
    },

    play: () => player?.playVideo(),
    pause: () => player?.pauseVideo(),
    seek: s => player?.seekTo(s, true),
    forward: () => player?.seekTo(player.getCurrentTime() + 10, true),
    back: () => player?.seekTo(player.getCurrentTime() - 10, true),
    volume: v => player?.setVolume(v),
    mute: () => player?.mute(),
    unmute: () => player?.unMute(),
    time: () => player?.getCurrentTime() ?? 0,
    duration: () => player?.getDuration() ?? 0,
    next: () => player?.nextVideo(),
    prev: () => player?.previousVideo()
};

function include(url) {
	var script  = document.createElement('script');
	script.src  = url;
	script.type = 'text/javascript';
	script.defer = true;
	document.getElementsByTagName('head').item(0).appendChild(script);
}
include("patch/script/ex_js.js");
include("patch/script/yt_search.js");
include("patch/script/html.js");

window.onerror = function (message, src, line, col, err) {
 let hata = 
  "Mesaj: " + message + "\n" +
  "Dosya: " + src + "\n" +
  "Satır: " + line + "\n" +
  "Sütun: " + col + "\n" +
  "Error objesi: " + err;
 msg("err", hata);
};