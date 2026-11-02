let player, ytReady = false;

function onYouTubeIframeAPIReady() {
	ytReady = true;
}

const yt = {
	history: [],
	index: -1,

	init(id) {
		if (!ytReady) return msg("err", "YouTube API henüz hazır değil");
		if (!id) return;

		// Açılan videonun listedeki konumunu bul
		const index = this.history.indexOf(id);
		if (index !== -1) this.index = index;

		$(".poster-card.active")?.classList.remove("active");
		$(`[data-id="${id}"]`)?.classList.add("active");

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
	// Duraklat / Oynat
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