import { navigate, loadCSS } from "./main.js";

const handleClick = (event) => {
	const roomIDInput = document.getElementById("room-id");
	if (!roomIDInput) return; // Check if the element exists
	
	const roomID = roomIDInput.value;
	if (event.target) {
		if (event.target.id === "matchmaking") {
			// fetch("http://localhost:8000/api/matchmaking", {
			// 	method: "GET"
			// })
			// .then(response => response.json())
			// .then(data => {
			// 	navigate("/game?roomID=" + data.roomID);
			// })
			// .catch(error => {
			// 	console.error("Error: ", error);
			// });
			navigate("/game");
		}
		else if (event.target.id === "custom") {
			console.log("Custom ", roomID);
			// navigate("/custom");
		}
	}
};

export default () => {
	loadCSS("src/css/vs-player.css");

	document.removeEventListener("click", handleClick);
	document.addEventListener("click", handleClick);

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

