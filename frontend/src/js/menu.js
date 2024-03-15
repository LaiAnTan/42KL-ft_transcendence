import { router, loadCSS, resetCSS } from "./main.js";

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
					sessionStorage.setItem('profile_pic', data.json.profile_pic);
					history.replaceState("", "", "/menu");
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

	return `
<div class="d-flex flex-column h-100">
	<button data-link="/settings" type="button" class="go-back-button ml-4" style="z-index: 1">
		<img id="settings-button" src="src/assets/settings.png" style="height: 50px; width: 50px"></img>
	</button>
	<div class="menu-header unselectable">
		<p class="text-center menu-header-title h-100 my-4">MAIN MENU</p>
	</div>
	<button title="To dashboard" data-link="/dashboard?username=${sessionStorage.getItem('username')}" type="submit" class="user-profile unselectable scale-up mr-4" style="z-index: 1">
		<div class="user-img"><img src="${sessionStorage.getItem('profile_pic')}"></img></div>
		<p class="description cursor-pointer">${sessionStorage.getItem('display_name')}</p>
	</button>
	<div class="d-flex flex-column align-items-center justify-content-evenly unselectable flex-grow-1 px-4">
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
</div>`;
};
