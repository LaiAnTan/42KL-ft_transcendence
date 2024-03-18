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
	<button data-link="/menu" type="button" class="go-back-button scale-up ml-4" style="z-index: 1">
		<p class="description scale-up cursor-pointer">GO BACK</p>
	</button>
	<div class="menu-header unselectable">
		<p class="text-center menu-header-title h-100 my-4">VS PLAYER</p>
	</div>
	<button title="To dashboard" data-link="/dashboard?username=${sessionStorage.getItem('username')}" type="submit" class="user-profile unselectable scale-up mr-4" style="z-index: 1">
		<div class="user-img"><img src="${sessionStorage.getItem('profile_pic')}"></img></div>
		<p class="description cursor-pointer">${sessionStorage.getItem('display_name')}</p>
	</button>
	<div class="d-flex justify-content-center w-100">
		<div id="room-id-div" class="mx-4">
			<input type="text" id="room-id" class="vs-player-input w-80" placeholder="Join a room" />
			<button type="button" id="search-button" class="scale-up description" style="background-color: transparent; height: 50px; border-radius: 10px;">SEARCH</button>
		</div>
	</div>
	<div class="d-flex flex-column align-items-center justify-content-around unselectable flex-grow-1 px-4" style="margin-bottom: 110px">
		<button type="button" data-link="/game" class="menu-component cursor-pointer" style="background-color: transparent">
			<div class="menu-component-title">MATCHMAKING</div>
			<div class="menu-component-description">MATCH WITH A RANDOM PLAYER</div>
		</button>
		<button type="button" data-link="/" class="menu-component cursor-pointer" style="background-color: transparent">
			<div class="menu-component-title">CUSTOM</div>
			<div class="menu-component-description">CREATE A ROOM, INVITE A FRIEND</div>
		</button>
	</div>
</div>`;
	new_div.innerHTML = ret;
	app.outerHTML = new_div.outerHTML;

	$('#search-button').on('click', function () {
		console.log(`Searching for room ${$('#room-id').val()}`);
	});
};