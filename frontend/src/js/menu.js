import { router, loadCSS } from "./main.js";

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
					sessionStorage.setItem('username', data.json.login);
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
	<div class="menu-header unselectable">
		<p class="h-100 m-0 text-center menu-header-title">MAIN MENU</p>
	</div>
	<div class="d-flex flex-column align-items-center justify-content-evenly unselectable flex-grow-1 px-4">
		<div data-link="/vs-player" id="vs-player" class="menu-component vs-player">
			<div class="menu-component-title">VS PLAYER</div>
			<div class="menu-component-description">PLAY AGAINST OTHER PLAYERS</div>
		</div>
		<div data-link="/vs-ai" id="vs-ai" class="menu-component vs-ai cursor-pointer">
			<div class="menu-component-title">VS AI</div>
			<div class="menu-component-description">PLAY 1V1 AGAINST AN AI</div>
		</div>
		<div data-link="/" id="tourney" class="menu-component tournament cursor-pointer">
			<div class="menu-component-title">TOURNAMENT</div>
			<div class="menu-component-description">BRACKET-STYLED TOURNAMENT</div>
		</div>
	</div>
</div>`;
};
