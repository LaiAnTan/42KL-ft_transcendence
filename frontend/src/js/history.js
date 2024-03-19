import { loadCSS, navigate } from './main.js'

export default () => {
	const queryString = window.location.search;
	if (!queryString) { navigate("/menu"); }

	const params = {};
	const paramPairs = queryString.slice(1).split('&');
	for (const pair of paramPairs) {
		const [key, val] = pair.split('=');
		params[key] = val;
	}

	let config_palette = localStorage.getItem("palette");
	loadCSS("src/css/palettes/" + config_palette + ".css");
	loadCSS("src/css/history.css");


	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const formattedDate = date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
		return formattedDate;
	};

	const getMatchData = () => {
		fetch(`http://localhost:8000/api/getUser?username=${params['username']}`, {
			method: 'GET'
		}).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				throw new Error('Network response was not ok.');
			}
		}).then(data => {
			if (data.username == '') {
				let app = document.querySelector('#app');
				const new_div = document.createElement('div');
				new_div.setAttribute('id', 'app');
				new_div.className = 'w-100 h-100';
				new_div.innerHTML = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/menu" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex align-items-center justify-content-center h-100">
	<div class="important-label" style="font-size: 50px;">User ${params['username']} does not exist.</div>
</div>`;
				app.outerHTML = new_div.outerHTML;
			} else {
				return data.versus_history;
			}
		}).then(versus_history => {
			return Promise.all(versus_history.map(matchID => {
				return fetch(`http://localhost:8000/api/getVersus?id=${matchID}`, {
					method: 'GET'
				}).then(res => {
					if (res.ok) {
						return res.json();
					} else {
						throw new Error('Network response was not ok.');
					}
				});
			}));
		}).then(matches => {
			let data_html = '';

			matches.forEach(data => {
				const backgroundColor = data.player_1_score > data.player_2_score ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
				const html_str = `
<div class="d-table-row description" style="background-color: ${backgroundColor};">
	<div class="data-display d-table-cell">${formatDate(data.date_played)}</div>
	<div class="data-display d-table-cell">${data.player_1_id}</div>
	<div class="data-display d-table-cell">${data.player_1_score}</div>
	<div class="data-display d-table-cell">${data.player_2_score}</div>
	<div class="data-display d-table-cell">${data.player_2_id}</div>
</div>`;
				data_html += html_str;
			});
			return data_html;
		}).then(data_html => {
			let app = document.querySelector('#app');
			const new_div = document.createElement('div');
			new_div.setAttribute('id', 'app');
			new_div.className = 'w-100 h-100';
			new_div.innerHTML = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 110px; z-index: 1">
	<p data-link="/dashboard?username=${params['username']}" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="menu-header unselectable">
	<p class="text-center menu-header-title h-100 my-4">HISTORY</p>
</div>
<div class="d-flex align-items-center justify-content-center w-100">
	<div class="d-table w-80 mt-3" style="max-width: 1200px">
		<div class="d-table-row important-label">
			<div class="headers d-table-cell"></div>
			<div class="headers d-table-cell"></div>
			<div class="headers d-table-cell"><i>Score</i></div>
			<div class="headers d-table-cell"><i>Score</i></div>
			<div class="headers d-table-cell"><i>Opponent</i></div>
		</div>
		${data_html}
	</div>
</div>`;
			app.outerHTML = new_div.outerHTML;
		}).catch(err => {
			console.error('Error sending code:', err);
		});
	}


	getMatchData();
	return ;
}