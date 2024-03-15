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
	<div class="user-profile unselectable scale-up mr-4" style="z-index: 1">
		<button title="To dashboard" data-link="/dashboard?username=${sessionStorage.getItem('username')}&loading=true" type="submit" class="user-img"><img src="${sessionStorage.getItem('profile_pic')}"></img></button>
		<p class="description cursor-pointer">${sessionStorage.getItem('display_name')}</p>
	</div>
	<div class="d-flex flex-row justify-content-evenly unselectable flex-grow-1" style="padding: 100px 0">
		<div class="d-flex flex-column rounded-border w-45 p-3 mr-1" style="min-width: 300px; max-width: 600px; min-height: 400px;">
			<p class="important-label pb-4">SETTINGS</p>
			<div class="mx-auto w-80" style="min-width: 300px;">
				<p class="important-label mr-auto pb-3" style="font-size: 30px">DIFFICULTY</p>
				<input type="range" min="1" max="3" value="2" style="min-width: 300px; width: 100%;">
				<div class="d-flex flex-row justify-content-between w-100 pt-2" style="min-width: 300px" width: 100%;>
					<p class="important-label" style="font-size: 20px; font-weight: 0;">Easy</p>
					<p class="important-label" style="font-size: 20px; font-weight: 0;">Normal</p>
					<p class="important-label" style="font-size: 20px; font-weight: 0;">Hard</p>
				</div>
			</div>
		</div>
		<div class="d-flex flex-column justify-content-between w-45 ml-1" style="min-width: 300px; max-width: 600px; min-height: 400px;">
			<div class="d-flex flex-column rounded-border h-85 p-3">
				<p class="important-label">GAME MODE</p>
				<div class="d-flex flex-column justify-content-around mx-auto w-80" style="min-width: 300px; height: 100%">
					<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up mx-2 my-2" style="min-width: 300px; width: 100%;">
						<div class="d-flex flex-row align-items-center">
							<img src="src/assets/star-empty.png" alt="Classic" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
							<p class="important-label pl-2" style="font-size: 40px">CLASSIC</p>
						</div>
						<p class="description px-3">KEEP IT CLASSIC</p>
					</div>
					<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up mx-2 my-2" style="min-width: 300px; width: 100%;">
						<div class="d-flex flex-row align-items-center">
							<img src="src/assets/star-empty.png" alt="Dong" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
							<p class="important-label pl-2" style="font-size: 40px">DONG</p>
						</div>
						<p class="description px-3">DODGE THE BALLS</p>
					</div>
					<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up mx-2 my-2" style="min-width: 300px; width: 100%;">
						<div class="d-flex flex-row align-items-center">
							<img src="src/assets/star-empty.png" alt="Bong" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
							<p class="important-label pl-2" style="font-size: 40px">BONG</p>
						</div>
						<p class="description px-3">BRICK BREAKER EDITION</p>
					</div>
				</div>
			</div>
			<div class="rounded-border play-button text-center cursor-pointer ml-auto w-50 mt-2" style="height: 75px"><p class="important-label">PLAY</p></div>
		</div>
	</div>
</div>`;
};
	
