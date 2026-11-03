const $ = s => document.querySelector(s);

window.onload = () => {

};

function button_yt(id){
	yt.init(id);
}

function startVoice() {
	const native = window.NativeSpeech;

	if (typeof native?.startListening !== "function")
		return msg("err", "Ses tanıma kullanılamıyor.");

	if (startVoice.listening) return;
	startVoice.listening = true;

	window.onNativeSpeechResult = text => {
		startVoice.listening = false;
		if (typeof text !== "string") return;

		text = text.trim();

		if (text.startsWith("Ses tanıma hatası:"))
			return msg("err", text);

		if (!text)
			return msg("err", "Konuşma algılanamadı.");

		const input = $("#text");

		if (input) {
			input.value = text;
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}

		msg("ok", "Konuşma algılandı");
	};

	try {
	    native.startListening();
	    msg("ok", "Dinleniyor...");
	} catch (error) {
	    startVoice.listening = false;
	    msg("err", "Ses tanıma başlatılamadı.");
	    console.error(error);
	}
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