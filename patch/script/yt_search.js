selectKEYS = function() {
	return "AIzaSyD2fmjamG1csqvcQQl5sRfjLL-hA1rqDlk";
}

yt_search = function(id = null) {
	var params = {
		part: "id",
		type: "video",
		order: "relevance",
		topicId: "/m/04rlf",
		videoCategoryId: "10",
		videoDuration: "medium",
		relevanceLanguage: "tr",
		fields: "items(id/videoId)", //,nextPageToken
		key: selectKEYS()
	};
	if(id == null){
		var text = $("#text").value;
		//params.q = text;
		params.q = text + " -ai -remix -yapayzeka -edit -sözleri -slowed -spedup"; // -cover
		params.maxResults = "15";
	}else {
		params.q = id;
		//params.relatedToVideoId = id;
		//params.maxResults = "14";
	}
	if(text != ""){
		$(".icon-search").className = "icon-spin big";
		if (window.CarKeyboard && $("#__aakb")) CarKeyboard.stopKeyboard();
		getJSON("https://www.googleapis.com/youtube/v3/search?", params, function(err, data) {
			if (err === null) {
				if (id !== null)
					data.items.unshift({id: {videoId: id}});
				const videos = data.items.map(i => i.id.videoId).filter(Boolean);
				yt_videos(videos.join(","));
				yt.setList(videos);
			}
			$(".icon-spin.big").className = "icon-search big";
		});
	}else{
		msg("war", "En az 3 karakter girin!");
		$("#text").focus();
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
			var res, results = $(".results");
			results.innerHTML = "";
			data.items.forEach(function(item) {
				var	time = item.contentDetails.duration.match(/[0-9]+/g);
				(time[1] < 10) ? time[1] = 0+time[1] : (time[1] === undefined) ? time[1] = "00" : time[1];
				res = {
					id: item.id,
					title: yt_temiz(item.snippet.title, {delimiter:' ', limit: 48, lowercase: false, alphanumeric: false}),
					duration: time.join(":"),
					duration_car: toSeconds(item.contentDetails.duration),
					date: tarih(item.snippet.publishedAt),
					popularity: views(item.statistics.viewCount)
				};
				results.insertAdjacentHTML('beforeend', Search_Yaz(res));
			});
		}
	});
}

function yt_related(title) {
	const api = "https://www.googleapis.com/youtube/v3/";
	const key = selectKEYS();

	getJSON(api + "search?", {
		part: "id",
		type: "playlist",
		q: title,
		order: "relevance",
		maxResults: 1,
		fields: "items(id/playlistId)",
		key
	}, function(err, data) {
		if (err || !data.items?.length) return;

		const playlistId = data.items[0].id.playlistId;

		getJSON(api + "playlistItems?", {
			part: "contentDetails",
			playlistId,
			maxResults: 15,
			fields: "items(contentDetails/videoId)",
			key
		}, function(err, data) {
			if (err || !data.items?.length) return;

			const videos = [...new Set(
				data.items.map(x => x.contentDetails.videoId).filter(Boolean)
			)];

			yt_videos(videos.join(","));
			yt.setList(videos);
		});
	});
}

function toSeconds(duration) {
	const [, h = 0, m = 0, s = 0] =
	  duration.match(/(?:PT)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	return +h * 3600 + +m * 60 + +s;
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