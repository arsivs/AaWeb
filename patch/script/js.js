const $ = s => document.querySelector(s);

window.onload = () => {

};

function button_yt(id){
  yt.init(id);
}

function startVoice() {
  const input = document.getElementById('text');

  if (!window.NativeSpeech ||
      typeof window.NativeSpeech.startListening !== 'function') {
      msg("err", "Android ses tanıma köprüsü bulunamadı.");
      return;
  }

  window.onNativeSpeechResult = function(text) {
      if (text.startsWith("Ses tanıma hatası:")) {
          msg("err", text);
          return;
      }

      if (input && text) {
          input.value = text;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          msg("ok", "Konuşma algılandı: " + text);
      }
  };

  msg("ok", "Dinleniyor...");
  window.NativeSpeech.startListening();
}

function include(url) {
	var script  = document.createElement('script');
	script.src  = url;
	script.type = 'text/javascript';
	script.defer = true;
	$("head").appendChild(script);
}
include("patch/script/ex_js.js");
include("patch/script/yt_search.js");
include("patch/script/yt_player.js");
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