encodeDataToURL = (data) => {
  var parameters = [];
  for (var property in data) {
    if (data.hasOwnProperty(property)) {
      parameters.push(encodeURI(property + '=' + data[property]));
    }
  }
  return parameters.join('&');
}

getJSON = function(url, params, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url+encodeDataToURL(params), true);
  xhr.responseType = 'json';
  xhr.timeout = 30000;
  xhr.send();

  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      //callback(status, xhr.response);
      msg("Bir şeyler yanlış gitti", "error");
      console.log('Bir şeyler yanlış gitti: ' + err);
    }
  };
  xhr.onreadystatechange = function(event) {
    if (xhr.readyState == 4) {
      //prog.style.display = "none";
    }
  }
  xhr.ontimeout = function (e) {
    msg("Çok uzun sürdü tekrar dene!", "error");
  };
  xhr.onerror = function() {
    msg("İnternet bağlantısı yok!", "error");
  };
};


/* Ayarlar LocalStorage Start */
const Ayarlar = {
  // LocalStorage anahtarımız
  key: "ayarlar",

  // Varsayılan boş obje/dizi ile ayarlar yükle
  load() {
    let data = localStorage.getItem(this.key);
    if (!data) {
      localStorage.setItem(this.key, JSON.stringify({}));
      return {};
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Ayarlar JSON bozuk, sıfırlandı.", e);
      localStorage.setItem(this.key, JSON.stringify({}));
      return {};
    }
  },

  // Ayarları kaydet
  save(obj) {
    localStorage.setItem(this.key, JSON.stringify(obj));
  },

  // Belirli bir ayarı getir
  get(name) {
    const data = this.load();
    return data[name];
  },

  // Yeni ayar ekle veya güncelle
  set(name, value) {
    const data = this.load();
    data[name] = value;
    this.save(data);
    return data;
  },

  // Tüm ayarları al
  all() {
    return this.load();
  },

  // Belirli bir ayarı sil
  remove(name) {
    const data = this.load();
    delete data[name];
    this.save(data);
    return data;
  }
};
// Ayarlar.all();  Eğer ayarlar yoksa otomatik oluşturur / Tüm ayarları gör
// Ayarlar.set("tema", "koyu");  Yeni ayar ekle
// Ayarlar.get("tema");  Ayarı oku
// Ayarlar.remove("tema");  Ayarı sil
/* Ayarlar LocalStorage End */

function msg(type, msg){
	var sec = document.querySelector('.notice');
	sec.style.display = "block";
	sec.innerHTML = '<div class="msg '+type+'">'+msg+'</div>';
	sec.querySelector('.msg').onanimationend = (e) => {
		e.target.remove();
		sec.style.display = "none";
	};
}

// ononline version
window.ononline = (event) => {
	msg("ok", "İnternet Bağlantısı Aktif");
};

// onoffline version
window.onoffline = (event) => {
	msg("err", "İnternet Bağlantısı Kesildi");
};