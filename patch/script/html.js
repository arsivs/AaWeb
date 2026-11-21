function Search_Yaz(items) {
	return 	`<div data-id="${items.id}" class="poster-card" onclick="button_yt('${items.id}');">
			<div class="image"><img src="https://i.ytimg.com/vi/${items.id}/mqdefault.jpg"><b>${items.duration}</b></div>
			<div class="info">
				<h3>${items.title}</h3>
				<p data-time="${items.duration_car}">${items.popularity} • ${items.date}</p>
			</div>
			<div class="action">
				<i class="icon-play mid"></i>
				<span class="bars"><b></b><b></b><b></b></span>
			</div>
		</div>`;
}

function menu_select(res, btn) {
  const pages = {
  	left: `<div class="head">
		<button class="close" onclick="$('.yt_content').classList.remove('set');$('.settings .lt').innerHTML='';$('.settings .rt').innerHTML='';"><i class="icon-close"></i></button>
		<i class="icon-settings big"></i>
		<h2>Ayarlar</h2>
  		<button class="reset" onclick="settingsPanel.reset()"><i class="icon-reset"></i></button>
	</div>
	<div class="nav">
		<button class="item" onclick="menu_select('music', this)"><i class="icon-music big"></i>Müzik Arama</button>
		<button class="item" onclick="menu_select('player', this)"><i class="icon-play big"></i>Oynatma</button>
		<button class="item" onclick="menu_select('display', this)"><i class="icon-sliders big"></i>Görünüm</button>
		<button class="item" onclick="menu_select('region', this)"><i class="icon-globe big"></i>Dil ve Bölge</button>
		<button class="item" onclick="menu_select('data', this)"><i class="icon-database big"></i>Veri ve Önbellek</button>
		<button class="item" onclick="menu_select('about', this)"><i class="icon-info big"></i>Uygulama Hakkında</button>
	</div>`,

	music: `<div class="head">
		<i class="icon-music big"></i>
		<div>
			<h2>Müzik Arama Ayarları</h2>
			<p>Arama sonuçlarını ve müzik bulma davranışını özelleştir.</p>
		</div>
	</div>
	<div class="section">
		<div class="row">
			<i class="icon-globe big"></i>
			<div class="label">
				<strong>Sonuç Dili</strong>
				<small>YouTube aramalarında tercih edilen dil.</small>
			</div>
			<select name="language" data-setting="search_lang">
				<option value="tr">Türkçe (TR)</option>
				<option value="en">İngilizce (EN)</option>
			</select>
		</div>
		<div class="row">
			<i class="icon-list big"></i>
			<div class="label">
				<strong>Sonuç Sayısı</strong>
				<small>Her aramada kaç video listeleneceğini belirle.</small>
			</div>
			<div class="stepper" data-setting="search_limit">
				<button type="button" data-step="-1">−</button>
				<output id="max-count">15</output>
				<button type="button" data-step="1">+</button>
			</div>
		</div>
		<div class="row">
			<i class="icon-filter big"></i>
			<div class="label">
				<strong>Video Süresi</strong>
				<small>Aramalarda uygulanacak YouTube süre filtresi.</small>
			</div>
			<select name="duration" data-setting="search_duration">
				<option value="any">Tümü</option>
				<option value="short">Kısa (4 dk altı)</option>
				<option value="medium">Orta (4–20 dk)</option>
				<option value="long">Uzun (20 dk üzeri)</option>
			</select>
		</div>
		<div class="row">
			<i class="icon-shield big"></i>
			<div class="label">
				<strong>AI / Remix İçeriklerini Azalt</strong>
				<small>Arama sorgusuna hariç tutma kelimeleri ekler.</small>
			</div>
			<label class="switch">
				<input id="filter" type="checkbox" data-setting="search_ai_filter">
				<span></span>
			</label>
		</div>
		<div class="row">
			<i class="icon-trend big"></i>
			<div class="label">
				<strong>Popüler Sonuçlar</strong>
				<small>Arama sıralamasını izlenme sayısına göre yap.</small>
			</div>
			<label class="switch">
				<input id="popular" type="checkbox" data-setting="search_popular">
				<span></span>
			</label>
		</div>
	</div>`,

	player: `<div class="head">
		<i class="icon-play big"></i>
		<div>
			<h2>Oynatma Ayarları</h2>
			<p>Şarkıların nasıl oynatılacağını belirle.</p>
		</div>
	</div>
	<div class="section">
		<div class="row">
			<i class="icon-skip big"></i>
			<div class="label">
				<strong>Sonraki Şarkıya Geç</strong>
				<small>Şarkı bitince listedeki sonraki videoyu oynat.</small>
			</div>
			<label class="switch">
				<input id="autoNext" type="checkbox" data-setting="auto_next">
				<span></span>
			</label>
		</div>
		<div class="row">
			<i class="icon-play big"></i>
			<div class="label">
				<strong>Otomatik Oynatma</strong>
				<small>Seçilen şarkıyı otomatik başlat.</small>
			</div>
			<label class="switch">
				<input id="autoplay" type="checkbox" data-setting="auto_play">
				<span></span>
			</label>
		</div>
	</div>`,

	display: `<div class="head">
		<i class="icon-sliders big"></i>
		<div>
			<h2>Görünüm Ayarları</h2>
			<p>AutoX arayüzünü kişiselleştir.</p>
		</div>
	</div>
	<div class="section">
		<div class="row">
			<i class="icon-info big"></i>
			<div class="label">
				<strong>Bildirimler</strong>
				<small>Ekran içi durum mesajlarını göster.</small>
			</div>
			<label class="switch">
				<input id="notices" type="checkbox" data-setting="notices">
				<span></span>
			</label>
		</div>
	</div>`,

	region: `<div class="head">
		<i class="icon-globe big"></i>
		<div>
			<h2>Dil ve Bölge</h2>
			<p>Arama sonuçlarının ülke tercihini belirle.</p>
		</div>
	</div>
	<div class="section">
		<div class="row">
			<i class="icon-globe big"></i>
			<div class="label">
				<strong>Arama Bölgesi</strong>
				<small>YouTube sonuçlarının ülke tercihi.</small>
			</div>
			<select name="region" data-setting="search_region">
				<option value="tr">Türkiye</option>
				<option value="us">ABD</option>
				<option value="de">Almanya</option>
				<option value="">Varsayılan</option>
			</select>
		</div>
	</div>`,

	data: `<div class="head">
		<i class="icon-database big"></i>
		<div>
			<h2>Veri ve Önbellek</h2>
			<p>Ayarları ve yerel verileri yönet.</p>
		</div>
	</div>
	<div class="section">
		<div class="row">
			<i class="icon-repeat big"></i>
			<div class="label">
				<strong>Kaydedilen Ayarlar</strong>
				<small>Bu paneldeki tercihler cihazda saklanır.</small>
			</div>
		</div>
	</div>`,

	about: `<div class="head">
		<i class="icon-database big"></i>
		<div>
			<h2>AutoX Hakkında</h2>
			<p>Kişisel müzik deneyimi için geliştirilen arayüz.</p>
		</div>
	</div>`
  };

  if(res == "left") {
	$(".settings .lt").innerHTML = pages[res];
	res = "music";
	btn = $(".lt .nav .item");
  }

  document.querySelector('.settings .item.active')?.classList.remove('active');
  btn.classList.add('active');
  $(".settings .rt").innerHTML = pages[res] || '';
  settingsPanel.load();
}

// Ayar paneli: dinamik HTML icin tek seferlik olay yonetimi.
// def_set, defaultSetValues ve Ayarlar mevcut uygulama tarafindan tanimlanir.

const settingsPanel = {
	load() {
		const root = document.querySelector('.settings .rt');
		if (!root) return;

		root.querySelectorAll('[data-setting]').forEach(el => {
			const value = def_set[el.dataset.setting];

			if (el.classList.contains('stepper')) {
				el.querySelector('output').textContent = value;
			} else if (el.type === 'checkbox') {
				el.checked = Boolean(value);
			} else {
				el.value = value;
			}
		});
	},

	reset() {
		if (!confirm("Tüm ayarlar varsayılana sıfırlansın mı?")) return;
		const data = Ayarlar.all();
		// Yalnızca ayarları sil
		for (const key in defaultSetValues) {
			delete data[key];
		}
		Ayarlar.save(data);
		Ayarlar.load();
		// Açık ayar sayfasını güncelle
		this.load();
	},

	init() {
		if (this.initialized) return;
		this.initialized = true;

		// Select ve checkbox değişiklikleri
		document.addEventListener('change', e => {
			const root = document.querySelector('.settings .rt');
			if (!root || !root.contains(e.target)) return;

			const el = e.target.closest('[data-setting]');
			if (!el || el.classList.contains('stepper')) return;

			Ayarlar.set(
				el.dataset.setting,
				el.type === 'checkbox' ? el.checked : el.value
			);
		});

		// Sonuç sayısı +/- butonları
		document.addEventListener('click', e => {
			const root = document.querySelector('.settings .rt');
			if (!root || !root.contains(e.target)) return;

			const btn = e.target.closest('[data-step]');
			if (!btn) return;

			const stepper = btn.closest('.stepper[data-setting]');
			if (!stepper) return;

			const key = stepper.dataset.setting;
			const next = Math.max(
				1,
				Math.min(50, Number(def_set[key]) + Number(btn.dataset.step))
			);

			Ayarlar.set(key, next);
			stepper.querySelector('output').textContent = next;
		});
	}
};


settingsPanel.init();
