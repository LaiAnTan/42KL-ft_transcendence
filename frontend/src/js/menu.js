import { router, loadCSS, resetCSS, navigate } from "./main.js";

export default () => {
	let config_palette = localStorage.getItem("palette");
	loadCSS("src/css/palettes/" + config_palette + ".css");
	loadCSS("src/css/menu.css");

	let queryString = new URLSearchParams(document.location.search);
	const code = queryString.get('code')


	const postCode = async () => {
		try {
			const response = await fetch("http://localhost:8000/api/postCode", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ "code": code }),
			});
			if (response.ok) {
				response.json().then(data => {
					console.log(data);
					sessionStorage.setItem('username', data.json.username);
					sessionStorage.setItem('display_name', data.json.display_name);
					sessionStorage.setItem('profile_pic', "http://localhost:8000/api" + data.json.profile_pic); 

					$.ajax({
						url: `http://localhost:8000/api/setOnlineStatus`,
						type: 'POST',
						contentType: 'application/json',
						data: JSON.stringify({ "username": data.json.username, "is_online": true }),
						error: function(jqXHR, textStatus, errorThrown) {
							alert("FAILED OAOAAOO");
							console.error('Error updating details:', jqXHR.responseJSON);
						}
					});

					window.history.replaceState("", "", "/menu");
					router();
				});
			} else {
				console.error('Failed to send code to the backend.');
			}
		} catch (error) {
		  console.error('Error sending code:', error);
		}
	};

	if (code) {
		postCode();
		return `
<div class="d-flex align-items-center justify-content-center h-100">
	<div class="important-label" style="font-size: 50px;">Authenticating... Stay put</div>
</div>`;
	};

	
	var current_user = sessionStorage.getItem('username');

	// This is to counter how Chrome handles beforeunload, where a page refresh
	// triggers the beforeunload event, causing our page to set the current user's
	// online status to offline
	fetch(`http://localhost:8000/api/getOnlineStatus?username=${current_user}`, {
		method: 'GET'
	})
	.then(res => res.json())
	.then(data => {
		$.ajax({
			url: `http://localhost:8000/api/setOnlineStatus`,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ "username": current_user, "is_online": true }),
			error: function(jqXHR, textStatus, errorThrown) {
				alert("FAILED OAOAAOO");
				console.error('Error updating details:', jqXHR.responseJSON);
			}
		});
	});

	let data_html = '';
	fetch(`http://localhost:8000/api/getFriends?username=${current_user}`, {
		method: 'GET'
	}).then(res => {
		return res.json();
	}).then(data => {
		data.friends.forEach(friend => {
			let statusColor = friend.is_online ? 'green' : 'red';
			let html_str = `
			<div data-link="/dashboard?username=${friend.username}" class="d-flex flex-row align-items-center justify-content-around friend-profile cursor-pointer w-100 m-1 py-2">
				<div class="profile-container" style="position: relative;">
					<img src="http://localhost:8000/api${friend.profile_pic}" style="height: 57px; width: 57px; border-radius: 50%" />
					<div class="status-indicator" style="background-color: ${statusColor};" title="${friend.is_online ? 'Online' : 'Offline'}"></div>
				</div>
				<div class="d-flex flex-column align-items-right h-100">
					<p class="description" style="opacity: 0.7; font-size: 17px">${friend.username}</p>
					<p class="description">${friend.display_name}</p>
				</div>
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
<div class="d-flex flex-column h-100">
	<button data-link="/settings" type="button" class="go-back-button ml-4" style="z-index: 1">
		<img id="settings-button" src="src/assets/settings.png" style="height: 50px; width: 50px"></img>
	</button>
	<div class="menu-header unselectable">
		<p class="text-center menu-header-title h-100 my-4">MAIN MENU</p>
	</div>
	<button title="To dashboard" data-link="/dashboard?username=${current_user}" type="submit" class="user-profile unselectable scale-up mr-4" style="z-index: 1">
		<div class="user-img"><img src="${sessionStorage.getItem('profile_pic')}"></img></div>
		<p class="description cursor-pointer">${sessionStorage.getItem('display_name')}</p>
	</button>
	<div class="d-flex flex-row flex-grow-1">
		<div class="d-flex flex-column align-items-center justify-content-evenly unselectable w-75 px-4">
			<button type="button" data-link="/vs-player" id="vs-player" class="menu-component vs-player cursor-pointer" style="background-color: transparent">
				<div class="menu-component-title">VS PLAYER</div>
				<div class="menu-component-description">PLAY AGAINST OTHER PLAYERS</div>
			</button>
			<button type="button" data-link="/vs-ai" id="vs-ai" class="menu-component vs-ai cursor-pointer" style="background-color: transparent">
				<div class="menu-component-title">VS AI</div>
				<div class="menu-component-description">PLAY 1V1 AGAINST AN AI</div>
			</button>
			<button type="button" data-link="/" id="tourney" class="menu-component tournament cursor-pointer" style="background-color: transparent">
				<div class="menu-component-title">TOURNAMENT</div>
				<div class="menu-component-description">BRACKET-STYLED TOURNAMENT</div>
			</button>
		</div>
		<div id="right-sidebar" class="d-flex flex-column border-left flex-grow-1" style="min-width: 330px">
			<div class="d-flex flex-column p-4">
				<p class="description">USER DASHBOARD</p>
				<div class="input-container mt-3">
					<input id="dashboard-search" type="text" placeholder="Search by Intra ID" class="description input-box" />
					<button id="dashboard-button" type="submit"><img src="../src/assets/search.png" style="width: 32px; height: 32px;"></img></button>
				</div>
			</div>
			<div class="d-flex flex-column p-4 w-100">
				<p class="description mb-4">FRIENDS</p>
				${data_html == '' ? `
				<p class="description" style="opacity: 0.5">
					No friends yet<br /><br />
					You can add someone<br />from their dashboard!
				</p>`
				: data_html}
			</div>
		</div>
	</div>
</div>`;
		app.outerHTML = new_div.outerHTML;

		$('#dashboard-button').click(function () {
			const username = $('#dashboard-search').val();
			if (username)
				navigate(`/dashboard?username=${username}`);
		});
	});

	return ;
};
