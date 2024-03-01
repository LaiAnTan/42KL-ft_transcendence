import { navigate, loadCSS } from "./main.js";

export default () => {
	loadCSS("src/css/vs-player.css");

	document.addEventListener("click", (event) => {
		const roomID = document.getElementById("room-id").value;
		if (event.target) {
			if (event.target.id === "matchmaking") {
				console.log("Matchmaking ", roomID);
				// navigate("/matchmaking");
			}
			else if (event.target.id === "custom") {
				console.log("Custom ", roomID);
				// navigate("/custom");
			}
		}
	});

	return `
<div class="menu-header unselectable" style="height: 8vh">
	<p class="text-center menu-header-title h-100 m-0 pt-2">VS PLAYER</p>
</div>
<div class="vs-player-content">
	<input type="text" id="room-id" class="vs-player-input" placeholder="Enter room ID">
	<button class="vs-player-component matchmaking" id="matchmaking">
		<div class="vs-player-component-title">MATCHMAKING</div>
		<div class="vs-player-component-description">MATCH WITH RANDOM PLAYERS</div>
	</button>
	<button class="vs-player-component" id="custom">
		<div class="vs-player-component-title">CUSTOM</div>
		<div class="vs-player-component-description">CREATE A PARTY AND INVITE FRIENDS</div>
	</button>
</div>
	`;
};