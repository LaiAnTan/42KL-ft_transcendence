import { navigate } from "./main.js";

export default () => {

	document.addEventListener("click", (event) => {
		if (event.target && event.target.id === "vs-player") {
		  navigate("/menu/vs-player");
		}
		else if (event.target && event.target.id === "vs-ai") {
		  navigate("/menu/vs-ai");
		}
		else if (event.target && event.target.id === "tourney") {
		  navigate("/");
		}
	  });

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