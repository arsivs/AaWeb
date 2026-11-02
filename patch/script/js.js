const $ = s => document.querySelector(s);
let player, ytReady = false;

window.onload = () => {

};

function button_yt(id){
  yt.init(id);
}

function startVoice() {
  const r = new webkitSpeechRecognition();
  r.lang = "tr-TR";
  r.onresult = e => $("#text").value =
    e.results[0][0].transcript;
  r.start();
}

function onYouTubeIframeAPIReady() {
    ytReady = true;
}

const yt = {
  history: [],
  index: -1,

  init(id) {
    if (!ytReady) return msg("err", "YouTube API henüz hazır değil");
    if (!id) return;

    if (player) return player.loadVideoById(id);

    player = new YT.Player('player', {
      width: '100%',
      height: '100%',
      videoId: id,
      playerVars: {
          autoplay: 1,
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          loop: 0,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          rel: 0
      },
      events: {
          onApiChange: (event) => {
              if (event.target.getOptions().includes('captions')) {
                  event.target.unloadModule('captions');
              }
          }
      }
    });
    $(".poster-card.active")?.classList.remove("active");
    $(`[data-id="${id}"]`).classList.add("active");
  },

  // Video listesini ayarla ve seçilen videoyu başlat
  setList(ids, startIndex = 0) {
    if (!ytReady) return msg("err", "YouTube API henüz hazır değil");
    if (!Array.isArray(ids) || !ids.length) return;

    this.history = [...ids];
    this.index = Math.max(0, Math.min(
        Math.trunc(startIndex) || 0,
        ids.length - 1
    ));
    // İLk videoyu başlat
    //this.init(this.history[this.index]);
  },

  // Sonraki video
  next() {
    if (this.index >= this.history.length - 1) return;

    this.index++;
    this.init(this.history[this.index]);
  },

  // Önceki video
  prev() {
    if (this.index <= 0) return;

    this.index--;
    this.init(this.history[this.index]);
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
  duration: () => player?.getDuration() ?? 0
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