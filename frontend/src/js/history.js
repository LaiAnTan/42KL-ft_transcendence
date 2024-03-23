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
		const options = {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		};
		return date.toLocaleString('en-US', options).replace(',', '');
	};

	const getMatchData = () => {
		fetch(`https://localhost:8000/api/getUser?username=${params['username']}`, {
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
				return fetch(`https://localhost:8000/api/getVersus?id=${matchID}`, {
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
				console.log(data);
				let p1 = data.player_1_id;
				let p2 = data.player_2_id;
				let s1 = data.player_1_score;
				let s2 = data.player_2_score;
				var winner = s1 > s2 ? p1 : p2;
				const backgroundColor = params['username'] == winner ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

				if (params['username'] == p2) {
					[p1, p2] = [p2, p1];
					[s1, s2] = [s2, s1];
				}

				let html_str = `
<div class="d-table-row description" style="background-color: ${backgroundColor};">
	<div class="data-display d-table-cell">${formatDate(data.date_played)}</div>
	<div class="data-display d-table-cell">${p1}</div>
	<div class="data-display d-table-cell">${s1}</div>
	<div class="data-display d-table-cell">${s2}</div>
	<div class="data-display d-table-cell">${p2}</div>
	<div class="data-display d-table-cell">${data.match_type.toUpperCase()}</div>
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
	<p class="text-center menu-header-title h-100 my-4">${params['username'].toUpperCase()}'S GAME HISTORY</p>
</div>
<div class="d-flex align-items-center justify-content-center w-100" ${data_html == '' ? 'style="opacity: 0.3"' : ''}>
	<div class="d-table w-80 mt-3" style="max-width: 1200px">
		<div class="d-table-row important-label">
			<div class="headers d-table-cell"></div>
			<div class="headers d-table-cell"></div>
            <div class="headers d-table-cell"><i>Score</i></div>
            <div class="headers d-table-cell"></div>
			<div class="headers d-table-cell"><i>Opponent</i></div>
			<div class="headers d-table-cell"><i>Mode</i></div>
		</div>
		${data_html}
	</div>
</div>
${data_html == '' ? '<div class="d-flex align-items-center justify-content-center"><p class="important-label">No match history</p></div>' : ''}`;
			app.outerHTML = new_div.outerHTML;
		}).catch(err => {
			console.error('Error sending code:', err);
		});
	}


	getMatchData();
	return ;
}