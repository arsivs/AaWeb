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
			<select name="language">
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
			<div class="stepper">
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
			<select name="duration">
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
				<input id="filter" type="checkbox" checked="">
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
				<input id="popular" type="checkbox">
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
				<input id="autoNext" type="checkbox" checked="">
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
				<input id="autoplay" type="checkbox" checked="">
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
				<input id="notices" type="checkbox" checked="">
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
			<select name="region">
				<option value="tr">Türkiye</option>
				<option value="en">ABD</option>
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
			<i class="icon-reset big"></i>
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
}