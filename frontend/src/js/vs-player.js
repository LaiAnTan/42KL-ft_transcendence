import { loadCSS } from "./main.js";

export default () => {
	let config_palette = localStorage.getItem("palette");
	loadCSS("src/css/palettes/" + config_palette + ".css");
	loadCSS("src/css/vs-player.css");

	let app = document.getElementById("app");
	const new_div = document.createElement('div');
	new_div.setAttribute('id', 'app');
	new_div.className = 'w-100 h-100';
	let ret = `
<div class="d-flex flex-column h-100">
	<div class="d-flex position-absolute align-items-center unselectable ml-4" style="z-index: 1">
		<p class="description scale-up cursor-pointer">GO BACK</p>
	</div>
	<div class="menu-header unselectable">
		<p class="text-center menu-header-title h-100 my-4">VS PLAYER</p>
	</div>
	<div class="d-flex justify-content-center w-100">
		<div id="room-id-div" class="mx-4">
			<input type="text" id="room-id" class="vs-player-input w-80" placeholder="Join a room" />
			<button type="button" id="search-button" class="scale-up description" style="background-color: transparent; height: 50px; border-radius: 10px;">SEARCH</button>
		</div>
	</div>
	<div class="d-flex flex-column align-items-center justify-content-around unselectable flex-grow-1 px-4" style="margin-bottom: 110px">
		<button type="button" data-link="/game" class="menu-component cursor-pointer" style="background-color: transparent">
			<div class="menu-component-title">MATCHMAKING</div>
			<div class="menu-component-description">MATCH WITH RANDOM PLAYERS</div>
		</button>
		<button type="button" data-link="/" class="menu-component cursor-pointer" style="background-color: transparent">
			<div class="menu-component-title">CUSTOM</div>
			<div class="menu-component-description">CREATE A PARTY AND INVITE FRIENDS</div>
		</button>
	</div>
</div>`;
	new_div.innerHTML = ret;
	app.outerHTML = new_div.outerHTML;

	var roomID = '';
	const handleRoomID = (e) => { roomID = e.target.value; }
	const handleSearch = async (e) => {
		e.preventDefault();
		console.log(`Seach button clicked with roomID ${roomID}`);
	}

	let ptr_app = document.querySelector('#app');
	let newRoomID = ptr_app.querySelector('#room-id');
	let searchButton = ptr_app.querySelector('#search-button');

	newRoomID.addEventListener('input', handleRoomID);
	searchButton.addEventListener('click', handleSearch);
};