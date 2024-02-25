import { navigate, loadCSS } from "./main.js";

function game() {
	loadCSS("src/css/game.css");

	let player_1_score = 3;
	let player_2_score = 0;
	let player_1_username = "sealw4ll";
	let player_2_username = "lwilliam";

	return `
<div class="w-100 p-5 game-background">
<div class="d-flex justify-content-between w-80 mx-auto pb-3">
	<div class="d-flex flex-row player-text player-1-text-color justify-content-end align-items-end">
	<div class="player-score-text-size pr-2">${player_1_score.toString()}</div>
	<div class="player-username-text-size pb-2">${player_1_username}</div>
	</div>
	<div class="d-flex flex-row player-text player-2-text-color justify-content-end align-items-end">
	<div class="player-username-text-size pb-2">${player_2_username}</div>
	<div class="player-score-text-size pl-2">${player_2_score.toString()}</div>
	</div>
</div>
<div class="d-flex align-items-center justify-content-center game-box w-80 mx-auto">
	Game goes here
</div>
<div>
	
</div>
</div>
	`;
}

export default game;