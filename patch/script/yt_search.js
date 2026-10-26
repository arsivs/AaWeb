selectKEYS = function() {
	return "AIzaSyD2fmjamG1csqvcQQl5sRfjLL-hA1rqDlk";
}

yt_search = function(id = null) {
	var params = {
		part: "id",
		type: "video",
		topicId: "/m/04rlf",
		videoCategoryId: "10",
		videoDuration: "medium",
		relevanceLanguage: "en",
		fields: "items(id/videoId)", //,nextPageToken
		key: selectKEYS()
	};
	if(id == null){
		var text = document.getElementById("text").value;
		params.q = text;
		params.maxResults = "50";
	}else {
		params.relatedToVideoId = id;
		params.maxResults = "49";
	}
	if(text != ""){
		getJSON("https://www.googleapis.com/youtube/v3/search?", params, function(err, data) {
			if (err === null) {
				if(id !== null)
					data.items.unshift({"id": {videoId: id}});
				yt_videos( data.items.map(function(i){ return i.id.videoId; }).join(",") );
			}
		});
	}else{
		msg("En az 3 karakter girin!", "warning");
	}
}

function yt_videos(ids){
	var params = {
		id: ids,
		part: "snippet,contentDetails,statistics",
		fields: "items(id,snippet/title,snippet/publishedAt,statistics/viewCount,contentDetails/duration)",
		key: selectKEYS()
	};
	getJSON("https://www.googleapis.com/youtube/v3/videos?", params, function(err, data) {
		if (err === null) {
			var res, results = document.querySelector(".results");
			results.innerHTML = "";
			data.items.forEach(function(item) {
				var	time = item.contentDetails.duration.match(/[0-9]+/g);
				(time[1] < 10) ? time[1] = 0+time[1] : (time[1] === undefined) ? time[1] = "00" : time[1];
				res = {
					id: item.id,
					title: item.snippet.title, //url_slug(item.snippet.title, {delimiter:' ', lowercase: false, alphanumeric: false}), //item.snippet.title,
					duration: time.join(":"),
					date: tarih(item.snippet.publishedAt),
					popularity: views(item.statistics.viewCount)
				};
				results.insertAdjacentHTML('beforeend', Search_Yaz(res));
			});
		}
	});
}

function views(number) {
	var SI_POSTFIXES = ["", "K", "Mn", "Bn", "Tn", "P", "E"];
	// what tier? (determines SI prefix)
	var tier = Math.log10(Math.abs(number)) / 3 | 0;
	// if zero, we don't need a prefix
	if(tier == 0) return number;
	// get postfix and determine scale
	var postfix = SI_POSTFIXES[tier];
	var scale = Math.pow(10, tier * 3);
	// scale the number
	var scaled = number / scale;
	// format number and add postfix as suffix
	var formatted = scaled.toFixed(1) + '';
	// remove '.0' case
	if (/\.0$/.test(formatted))
		formatted = formatted.substr(0, formatted.length - 2);

	return formatted + postfix;
}

function tarih(previous) {
	var msPerMinute = 60;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;
	var elapsed = parseInt(new Date().getTime() / 1000) - parseInt(new Date(previous).getTime() / 1000);
	if (elapsed < msPerMinute) {
		if (elapsed < 20) {
			return 'az önce';
		} else {
			return Math.round(elapsed) + ' saniye önce';
		}
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + ' dakika önce';
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + ' saat önce';
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) + ' gün önce';
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + ' ay önce';
	} else {
		return Math.round(elapsed / msPerYear) + ' yıl önce';
	}
}