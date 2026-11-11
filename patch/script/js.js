const $ = s => document.querySelector(s);

window.onload = () => {
	yt_historyRender();

	const loading = $('.loading');
	loading.style.animation = "fade-out .400s forwards";
	loading.onanimationend = (e) => {
		e.target.remove();
	};
};

function button_yt(id){
	yt.init(id);
	yt_sonucKaydet();
}

function startVoice() {
	const native = window.NativeSpeech;
	const overlay = $(".rt .bg-cover");

	if (typeof native?.startListening !== "function")
		return msg("err", "Ses tanıma kullanılamıyor.");

	window.onNativeSpeechResult = (state, text) => {

		if (state === "permission") {
			overlay?.classList.remove("active");
			return msg("war", "Telefondan Mikrofon İznini Ver.");
		}

		if (state === "error") {
			overlay?.classList.remove("active");
			return msg("err", text);
		}

		if (state === "listening") {
			overlay?.classList.add("active");
			return;
		}

		const input = $("#text");

		if (input && (state === "partial" || state === "final")) {
			input.value = text ?? "";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}

		if (state === "final") {
			overlay?.classList.remove("active");

			if (input && input.value.trim()) {
				yt_search();
			}
		}
	};

	native.startListening();
}

function yt_sonucKaydet() {
	if (sonArama.q && !sonArama.kaydedildi && sonArama.items.length) {
		Ayarlar.historyAdd(sonArama.q, sonArama.items);
		sonArama.kaydedildi = true;
	}
}

function yt_historyRender() {
	const history = Ayarlar.get("sonAramalar") || [];
	const box = $(".results"); if (!box || !history.length) return;

	box.innerHTML = `<p class="history-haad">Son Aramalar<b>Tümünü Temizle</b></p>`;
	box.querySelector(".history-haad b").onclick = (e) => {
		e.stopPropagation();
		Ayarlar.remove("sonAramalar");
		Ayarlar.remove("last_play");
		box.innerHTML = "";
	};

	history.forEach((item, index) => {
		box.insertAdjacentHTML("beforeend", `<p class="history-item">
			<span class="history-text">${item.q}</span>
			<span class="history-sil">✕</span>
		</p>`);

		const el = box.lastElementChild;
		el.querySelector("span").onclick = () => yt_historyLoad(index);
		el.querySelector(".history-sil").onclick = (e) => {
			e.stopPropagation();
			let liste = Ayarlar.get("sonAramalar") || [];
			liste.splice(index, 1);
			Ayarlar.set("sonAramalar", liste);
			yt_historyRender();
		};
	});
	// Son dinlenenleri listele
	box.insertAdjacentHTML("beforeend", (Ayarlar.get("last_play") || []).map(Search_Yaz).join(""));
}

function yt_historyLoad(index) {
	const liste = Ayarlar.get("sonAramalar") || [];
	const item = liste[index];

	if (!item || !item.items || !item.items.length) return;

	// Seçilen aramayı en başa taşı
	liste.splice(index, 1);
	liste.unshift(item);
	Ayarlar.set("sonAramalar", liste);

	$("#text").value = item.q;
	sonArama = { q: item.q, items: item.items, kaydedildi: true };

	$(".results").innerHTML = item.items.map(Search_Yaz).join("");
	yt.setList(item.items.map(i => i.id));
}

function sendToCar(id) {
	if (window.AutoXMedia) {
		let select = $(`[data-id="${id}"]`), track = {
			name: select.querySelector("h3").innerText,
			desc: select.querySelector("p").innerText,
			image: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
			duration: select.querySelector("p").dataset.time,
			position: 0,
			playing: false // otomatik oynat: true
		}
		AutoXMedia.setNowPlaying(JSON.stringify(track));
	}
}

function include(url) {
	var script  = document.createElement('script');
	script.src  = url;
	script.type = 'text/javascript';
	//script.defer = true;
	$("head").appendChild(script);
}
include("patch/script/ex_js.js");
include("patch/script/yt_player.js");
include("patch/script/yt_search.js");
include("patch/script/yt_temizle.js");
include("patch/script/html.js");
include("https://www.youtube.com/iframe_api");

window.onerror = function (message, src, line, col, err) {
	let hata = 
	  "Mesaj: " + message + "\n" +
	  "Dosya: " + src + "\n" +
	  "Satır: " + line + "\n" +
	  "Sütun: " + col + "\n" +
	  "Error objesi: " + err;
	msg("err", hata);
};