//var _Son_izlenenler;

window.onload = () => {

};






function button_yt(id){
	document.querySelector(".rt").innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
}



window.addEventListener("keydown", (e) => {
  const key = (e.key && e.key !== "Unidentified") ? e.key : (e.keyCode ?? e.which);

  document.querySelector("#text").value = key;

  //msg("war", key);
});



function include(url) {
	var script  = document.createElement('script');
	script.src  = url;
	script.type = 'text/javascript';
	script.defer = true;
	document.getElementsByTagName('head').item(0).appendChild(script);
}
//include("patch/script/kumanda.js");

window.onerror = function (message, src, line, col, err) {
 let hata = 
  "Mesaj: " + message + "\n" +
  "Dosya: " + src + "\n" +
  "Satır: " + line + "\n" +
  "Sütun: " + col + "\n" +
  "Error objesi: " + err;
 msg("err", hata);
};