import { loadCSS } from "./main.js";

export default () => {
	let config_palette = localStorage.getItem("palette");
	loadCSS("src/css/palettes/" + config_palette + ".css");
	loadCSS("src/css/vs-ai.css");

	return `
<div class="d-flex flex-column h-100">
	<button data-link="/menu" type="button" class="go-back-button scale-up ml-4" style="z-index: 1">
		<p class="description scale-up cursor-pointer">GO BACK</p>
	</button>
	<div class="menu-header unselectable">
		<p class="text-center menu-header-title h-100 my-4">VS AI</p>
	</div>
	<button title="To dashboard" data-link="/dashboard?username=${sessionStorage.getItem('username')}" type="submit" class="user-profile unselectable scale-up mr-4" style="z-index: 1">
		<div class="user-img"><img src="${sessionStorage.getItem('profile_pic')}"></img></div>
		<p class="description cursor-pointer">${sessionStorage.getItem('display_name')}</p>
	</button>
	<div class="d-flex flex-row justify-content-evenly unselectable flex-grow-1" style="padding: 100px 0">
		<div class="d-flex flex-column rounded-border w-45 p-3 mr-1" style="min-width: 300px; max-width: 600px; min-height: 400px;">
			<p class="important-label pb-4">SETTINGS</p>
			<div class="mx-auto my-3 w-80" style="min-width: 300px;">
				<p class="important-label" style="font-size: 30px">DIFFICULTY</p>
				<input type="range" min="1" max="3" value="2" class="mt-3" style="min-width: 300px; width: 100%;">
				<div class="d-flex flex-row justify-content-between w-100 pt-2" style="min-width: 300px" width: 100%;>
					<p class="description" style="font-size: 20px">Easy</p>
					<p class="description" style="font-size: 20px">Normal</p>
					<p class="description" style="font-size: 20px">Hard</p>
				</div>
			</div>
		</div>
		<div class="d-flex flex-column justify-content-between w-45 ml-1" style="min-width: 300px; max-width: 600px; min-height: 400px;">
			<div class="d-flex flex-column rounded-border h-85 p-3">
				<p class="important-label">GAME MODE</p>
				<div class="d-flex flex-column justify-content-around mx-auto w-80" style="min-width: 300px; height: 100%">
					<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up m-2" style="min-width: 300px; width: 100%;">
						<div class="d-flex flex-row align-items-center">
							<img src="src/assets/star-empty.png" alt="Classic" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
							<p class="important-label pl-2" style="font-size: 40px">CLASSIC</p>
						</div>
						<p class="menu-component-description px-3" style="text-align: right">KEEP IT CLASSIC</p>
					</div>
					<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up m-2" style="min-width: 300px; width: 100%;">
						<div class="d-flex flex-row align-items-center">
							<img src="src/assets/star-empty.png" alt="Dong" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
							<p class="important-label pl-2" style="font-size: 40px">DONG</p>
						</div>
						<p class="menu-component-description px-3" style="text-align: right">DODGE THE BALLS</p>
					</div>
					<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up m-2" style="min-width: 300px; width: 100%;">
						<div class="d-flex flex-row align-items-center">
							<img src="src/assets/star-empty.png" alt="Bong" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
							<p class="important-label pl-2" style="font-size: 40px">BONG</p>
						</div>
						<p class="menu-component-description px-3" style="text-align: right">BRICK BREAKER EDITION</p>
					</div>
				</div>
			</div>
			<div class="d-flex align-items-center justify-content-center rounded-border play-button text-center cursor-pointer ml-auto mt-2 w-50" style="height: 75px">
				<p class="important-label">PLAY</p>
			</div>
		</div>
	</div>
</div>`;
};
	
