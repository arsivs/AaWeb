let player, ytReady = false;

function onYouTubeIframeAPIReady() {
    ytReady = true;
}

const yt = {
	history: [],
	index: -1,
	currentId: null,

	init(id) {
		if (!ytReady) return msg("err", "YouTube API henüz hazır değil");
		if (!id) return;

		// Açılan videonun listedeki konumunu bul
		this.index = this.history.indexOf(id);

		// Aktif poster kartını video değiştiğinde araca bilgi gönder
		if (this.currentId !== id) {
			this.currentId = id;
			sendToCar(id);
			// Son izlenenlere kaydet
			let liste = Ayarlar.get("last_play") || [];
			const video = sonArama.items.length ? sonArama.items[this.index] : liste.find(i => i.id === this.currentId);
			if (video) Ayarlar.set("last_play", [video, ...liste.filter(i => i.id !== video.id)].slice(0, 4));
		}

		$(".poster-card.active")?.classList.remove("active");
		$(`[data-id="${id}"]`)?.classList.add("active");

		// Mevcut oynatıcıyı yeniden kullan
		if (player) {
			player.loadVideoById(id);
			return;
		}

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
				onReady: (event) => {
					// İlk video otomatik başlamazsa başlat
					if (event.target.getPlayerState() !== YT.PlayerState.PLAYING) {
						event.target.playVideo();
					}
				},
				onStateChange: (event) => {
					const state = event.data;

					if (state === YT.PlayerState.PLAYING) {
						window.AutoXMedia?.setPlaying(true);
						$(`.poster-card.active .action`)?.classList.add("active");
						disableCaptions();
					}

					if ([YT.PlayerState.PAUSED,
					  YT.PlayerState.BUFFERING,
					  YT.PlayerState.ENDED].includes(state)) {
						window.AutoXMedia?.setPosition(event.target.getCurrentTime(), false);
						$(`.action.active`)?.classList.remove("active");
					}

					if (state === YT.PlayerState.ENDED) {
					    // yt.next();
					}
				},
				onApiChange: (event) => {
					disableCaptions();
				}
			}
		});
	},

	// Listeyi kaydet, otomatik oynatma
	setList(ids, startIndex = 0) {
		if (!Array.isArray(ids)) return;
		this.history = ids.filter(Boolean);
		if (!this.history.length) {
			this.index = -1;
			return;
		}

		// Oynatılan video yeni listede varsa konumunu koru
		const currentIndex = this.history.indexOf(this.currentId);
		this.index = currentIndex !== -1 ? currentIndex : -1;
	},
	// Duraklat / Oynat
	toggle() {
		if (!player) return this.init(this.history[this.index < 0 ? 0 : this.index]);
		player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
	},
	// Sonraki video
	next() {
		if (this.index >= this.history.length - 1) return;
		this.init(this.history[this.index < 0 ? 0 : this.index + 1]);
	},
	// Önceki video
	prev() {
		if (this.index <= 0) return;
		this.init(this.history[this.index - 1]);
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

function disableCaptions() {
	if (!ytReady || !player) return;
		try {
		if (player.getOptions().includes("captions")) {
			player.unloadModule("captions");
		}
	} catch (e) {
		console.warn("Altyazı kontrolü:", e);
	}
}