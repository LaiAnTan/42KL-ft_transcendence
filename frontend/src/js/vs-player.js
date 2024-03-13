import { loadCSS } from "./main.js";

export default () => {
	let config_palette = localStorage.getItem("palette");
	loadCSS("src/css/palettes/" + config_palette + ".css");
	loadCSS("src/css/vs-player.css");

	return `
<div class="d-flex flex-column h-100">
	<div class="d-flex position-absolute align-items-center unselectable ml-4" style="z-index: 1">
		<p class="description scale-up cursor-pointer">GO BACK</p>
	</div>
	<div class="menu-header unselectable">
		<p class="text-center menu-header-title h-100 m-0">VS PLAYER</p>
	</div>
	<div class="d-flex flex-column align-items-center justify-content-evenly unselectable flex-grow-1 px-4">
		<div class="d-flex flex-column justify-content-center align-items-center w-100">
			<input type="text" id="room-id" class="vs-player-input" placeholder=" [ OPTIONAL ] Enter room ID" style="margin-bottom: 30px" />
			<button type="button" data-link="/game" class="menu-component cursor-pointer" style="background-color: transparent">
				<div class="menu-component-title">MATCHMAKING</div>
				<div class="menu-component-description">MATCH WITH RANDOM PLAYERS</div>
			</button>
		</div>
		<button type="button" data-link="/" class="menu-component cursor-pointer" style="background-color: transparent">
			<div class="menu-component-title">CUSTOM</div>
			<div class="menu-component-description">CREATE A PARTY AND INVITE FRIENDS</div>
		</button>
	</div>
</div>`;
};

