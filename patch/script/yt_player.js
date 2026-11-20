let player, ytReady = false;
function onYouTubeIframeAPIReady() { ytReady = true; }

const yt = {
	history: [], index: -1, currentId: null,
	controlTimer: null, progressTimer: null,
	ui: {},

	setup() {
		const content = $('.yt_content');
		const control = $('.p_control');
		this.ui = {
			content, control,
			overlay: content?.querySelector('.rt'),
			playIcon: control?.querySelector('.icon-playerplay'),
			fullIcon: control?.querySelector('.icon-fullscreen'),
			time: control?.querySelector('.time'),
			root: document.documentElement
		};
		this.ui.overlay?.addEventListener('click', () => this.showControls());
	},

	init(id) {
		if (!ytReady) return msg('err', 'YouTube API henüz hazır değil');
		if (!id) return;
		this.index = this.history.indexOf(id);

		if (this.currentId !== id) {
			this.currentId = id;
			sendToCar(id);
			const list = Ayarlar.get('last_play') || [];
			const video = sonArama.items.find(i => i.id === id) || list.find(i => i.id === id);
			if (video) Ayarlar.set('last_play', [video, ...list.filter(i => i.id !== id)].slice(0, 4));
		}

		$('.poster-card.active')?.classList.remove('active');
		$(`[data-id="${id}"]`)?.classList.add('active');
		$('.yt_content .rt')?.classList.add('active');
		if (player) return player.loadVideoById(id);

		player = new YT.Player('player', {
			host: 'https://www.youtube-nocookie.com',
			width: '100%', height: '100%', videoId: id,
			playerVars: {
				autoplay: 1, playsinline: 1, controls: 0, disablekb: 1,
				loop: 0, fs: 0, iv_load_policy: 3, cc_load_policy: 0, rel: 0
			},
			events: {
				onReady: e => {
					this.setup();
					e.target.setVolume(100);
					if (e.target.getPlayerState() !== YT.PlayerState.PLAYING) e.target.playVideo();
				},
				onStateChange: e => this.onState(e),
				onApiChange: () => this.disableCaptions()
			}
		});
	},

	onState(e) {
		const state = e.data;
		const playing = state === YT.PlayerState.PLAYING;
		clearInterval(this.progressTimer);
		this.progress();
		if (playing) {
			this.showControls();
			this.ui.overlay.classList.add('block');
		} else {
			this.ui.control?.classList.remove('active');
			this.ui.overlay.classList.remove('block');
		}
		this.ui.playIcon?.classList.toggle('icon-pause', playing);

		if (playing) {
			window.AutoXMedia?.setPlaying(true);
			$('.poster-card.active .action')?.classList.add('active');
			this.disableCaptions();
			this.progressTimer = setInterval(() => this.progress(), 250);
		} else if ([YT.PlayerState.PAUSED, YT.PlayerState.BUFFERING, YT.PlayerState.ENDED].includes(state)) {
			window.AutoXMedia?.setPosition(e.target.getCurrentTime(), false);
			$('.action.active')?.classList.remove('active');
		}
	},

	disableCaptions() {
		if (!player || !ytReady) return;
		try {
			if (player.getOptions().includes('captions')) player.unloadModule('captions');
		} catch (e) { console.warn('Altyazı kontrolü:', e); }
	},

	setList(ids) {
		if (!Array.isArray(ids)) return;
		this.history = ids.filter(Boolean);
		this.index = this.history.indexOf(this.currentId);
	},
	toggle() {
		if (!player) return this.init(this.history[Math.max(0, this.index)]);
		player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
	},
	next() { if (this.index < this.history.length - 1) this.init(this.history[Math.max(0, this.index + 1)]); },
	prev() { if (this.index > 0) this.init(this.history[this.index - 1]); },
	full_Screen() {
		if (!player) return;
		this.ui.content?.classList.toggle('fullscreen');
		this.ui.fullIcon?.classList.toggle('icon-fullscreen-exit');
	},
	format(s) {
		s = Math.max(0, Math.floor(s || 0));
		const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = String(s % 60).padStart(2, '0');
		return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
	},
	progress() {
		if (!player) return;
		const duration = this.duration(), current = this.time();
		this.ui.root?.style.setProperty('--progress', duration ? current / duration * 100 : 0);
		if (this.ui.time) this.ui.time.textContent = `${this.format(duration - current)} / ${this.format(duration)}`;
	},
	seekProgress(e) {
		if (!player) return;
		const rect = e.currentTarget.getBoundingClientRect();
		if (!rect.width) return;
		this.seek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * this.duration());
		this.progress();
	},
	showControls() {
		clearTimeout(this.controlTimer);
		const state = player?.getPlayerState();
		const playing = state === YT.PlayerState.PLAYING;
		const visible = [YT.PlayerState.PLAYING, YT.PlayerState.PAUSED, YT.PlayerState.ENDED].includes(state);
		this.ui.control?.classList.toggle('active', visible);
		if (playing) {
			this.controlTimer = setTimeout(() => this.ui.control?.classList.remove('active'), 5000);
		}
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

// Eski harici çağrılar için uyumluluk.
function disableCaptions() { yt.disableCaptions(); }
