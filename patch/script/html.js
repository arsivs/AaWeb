function Search_Yaz(items) {
	return 	`<div id="${items.id}" class="poster-card" onclick="button_yt('${items.id}');">
			<div class="image"><img src="https://i.ytimg.com/vi/${items.id}/mqdefault.jpg"></div>
			<div class="info">
				<h3>${items.title}</h3>
				<p>${items.popularity} • ${items.date}</p>
			</div>
			<div class="duration">${items.duration}</div>
		</div>`;
}