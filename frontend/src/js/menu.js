import { navigate, loadCSS } from "./main.js";

export default () => {
	loadCSS("src/css/menu.css");

	let queryString = new URLSearchParams(document.location.search);
	const code = queryString.get('code')

	const postCode = async () => {
		try {
			const response = await fetch("http://localhost:8000/api/postCode/", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ "code": code }),
			});
			if (response.ok) {
				const data = await response.json();
				console.log('data', data);
				console.log('displayname: ', data.displayname);
				console.log('email: ', data.email);
			} else {
				console.error('Failed to send code to the backend.');
			}
		} catch (error) {
		  console.error('Error sending code:', error);
		}
	};

	if (code) {
		postCode();
	};

	const clickListeners = (event) => {
		if (event.target && event.target.id === "vs-player") {
			navigate("/vs-player");
			document.removeEventListener("click", clickListeners);
		}
		else if (event.target && event.target.id === "vs-ai") {
			navigate("/vs-ai");
			document.removeEventListener("click", clickListeners);
		}
		else if (event.target && event.target.id === "tourney") {
			navigate("/");
			document.removeEventListener("click", clickListeners);
		}
	}
	
	document.addEventListener("click", clickListeners);

	return `
<div class="menu-header unselectable" style="height: 8vh">
	<p class="h-100 m-0 text-center pt-2 menu-header-title">MAIN MENU</p>
</div>
<div class="d-flex flex-column align-items-center justify-content-around pt-4 pb-4 unselectable" style="height: 92vh">
	<div id="vs-player" class="menu-component vs-player cursor-pointer">
		<div class="menu-component-title">VS PLAYER</div>
		<div class="menu-component-description">PLAY AGAINST OTHER PLAYERS</div>
	</div>
	<div id="vs-ai" class="menu-component vs-ai cursor-pointer">
		<div class="menu-component-title">VS AI</div>
		<div class="menu-component-description">PLAY 1V1 AGAINST AN AI</div>
	</div>
	<div id="tourney" class="menu-component tournament cursor-pointer">
		<div class="menu-component-title">TOURNAMENT</div>
		<div class="menu-component-description">BRACKET-STYLED TOURNAMENT</div>
	</div>
</div>
	`;
};