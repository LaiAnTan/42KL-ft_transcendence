import { navigate, router, loadCSS } from "./main.js";

export default () => {
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
<div class="d-flex align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">Authenticating... Stay put</div>
</div>`;
	};

	let config_palette = localStorage.getItem("palette");
	let color1 = `--${config_palette}-1`;
	let color2 = `--${config_palette}-2`;
	let color3 = `--${config_palette}-3`;
	let color4 = `--${config_palette}-4`;
	let color5 = `--${config_palette}-5`;

	return `
<div class="menu-header unselectable" style="height: 8vh">
	<p class="h-100 m-0 text-center pt-2 menu-header-title">MAIN MENU</p>
</div>
<div class="d-flex flex-column align-items-center justify-content-around pt-4 pb-4 unselectable" style="height: 92vh">
	<div data-link="/vs-player" id="vs-player" class="menu-component vs-player" onmouseover="this.style.boxShadow='0 0 40px var(${color2})'" onmouseout="this.style.boxShadow='none'">
		<div class="menu-component-title">VS PLAYER</div>
		<div class="menu-component-description">PLAY AGAINST OTHER PLAYERS</div>
	</div>
	<div data-link="/vs-ai" id="vs-ai" class="menu-component vs-ai cursor-pointer" onmouseover="this.style.boxShadow='0 0 40px var(${color3})'" onmouseout="this.style.boxShadow='none'">
		<div class="menu-component-title">VS AI</div>
		<div class="menu-component-description">PLAY 1V1 AGAINST AN AI</div>
	</div>
	<div data-link="/" id="tourney" class="menu-component tournament cursor-pointer" onmouseover="this.style.boxShadow='0 0 40px var(${color4})'" onmouseout="this.style.boxShadow='none'">
		<div class="menu-component-title">TOURNAMENT</div>
		<div class="menu-component-description">BRACKET-STYLED TOURNAMENT</div>
	</div>
</div>`;
};
