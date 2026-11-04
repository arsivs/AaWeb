const $ = s => document.querySelector(s);

window.onload = () => {

};

function button_yt(id){
	yt.init(id);
}

document.querySelectorAll('.settings .item').forEach(btn => {
	btn.onclick = () => {
		document.querySelector('.settings .item.active')?.classList.remove('active');
		btn.classList.add('active');
	};
});

function startVoice() {
	const native = window.NativeSpeech;

	if (typeof native?.startListening !== "function")
		return msg("err", "Ses tanıma kullanılamıyor.");

	window.onNativeSpeechResult = (state, text) => {
		if (state === "permission") return msg("war", "Telefondan Mikrofon İznini Ver.");
		if (state === "error") return msg("err", text);
		if (state === "listening") return msg("ok", text);

		const input = $("#text");

		if (input) {
			input.value = text;
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}

		if (state === "final") msg("ok", "Konuşma algılandı");
	};

	native.startListening();
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