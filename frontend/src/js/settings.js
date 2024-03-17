import { loadCSS } from "./main.js";

export default () => {
	let config_palette = localStorage.getItem("palette");
	loadCSS("src/css/palettes/" + config_palette + ".css");
	loadCSS("src/css/settings.css");

	let app = document.querySelector('#app');
	const new_div = document.createElement('div');
	new_div.setAttribute('id', 'app');
	new_div.className = 'w-100 h-100';
	new_div.innerHTML = `
<div class="d-flex flex-column h-100">
	<button data-link="/menu" type="button" class="go-back-button scale-up ml-4" style="z-index: 1">
		<p class="description scale-up cursor-pointer">GO BACK</p>
	</button>
	<div class="menu-header unselectable" style="z-index: 0">
		<p class="text-center menu-header-title h-100 my-4" style="text-shadow: 0 0 25px var(--color5)">SETTINGS</p>
	</div>
	<div class="d-flex justify-content-center align-items-center important-label unselectable position-absolute mr-4" style="top: 0; right: 0; height: 110px; z-index: 1">
		SIGN OUT
	</div>
	<div class="d-flex align-items-center justify-content-center unselectable flex-grow-1 overflow-y">
		<div class="d-flex flex-column align-items-center justify-content-center m-4 w-50" style="min-width: 400px; max-width: 650px">
			<div class="border-left border-right h-100 w-100 p-4">
				<p class="important-label">GRAPHICS</p>
				<p class="description">Changes the particle effects</p>
				<div class="px-3 py-1">
					<div class="d-flex flex-row justify-content-evenly pt-1">
						<div class="px-1">
							<input type="radio" id="off" name="options" class="visually-hidden" />
							<label for="off" class="button-like description scale-up rounded-border cursor-pointer">OFF</label>
						</div>
						<div class="px-1">
							<input type="radio" id="low" name="options" class="visually-hidden" />
							<label for="low" class="button-like description scale-up rounded-border cursor-pointer">LOW</label>
						</div>
						<div class="px-1">
							<input type="radio" id="high" name="options" class="visually-hidden" />
							<label for="high" class="button-like description scale-up rounded-border cursor-pointer">HIGH</label>
						</div>
					</div>
				</div>
			</div>
			<div class="border-left border-right h-100 w-100 p-4">
				<p class="important-label">AUDIO</p>
				<p class="description">Adjust sound volumes</p>
				<div class="px-3 py-1">
					<div class="pt-1">
						<p class="description pb-4">Master</p>
						<input type="range" id="master" name="master" min="0" max="100" class="mx-auto w-100" style="min-width: 300px; max-width: 400px" />
					</div>
					<div class="pt-4">
						<p class="description pb-4">Game</p>
						<input type="range" id="game" name="game" min="0" max="100" class="mx-auto w-100" style="min-width: 300px; max-width: 400px" />
					</div>
					<div class="pt-4">
						<p class="description pb-4">Music</p>
						<input type="range" id="music" name="music" min="0" max="100" class="mx-auto w-100" style="min-width: 300px; max-width: 400px" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
	app.outerHTML = new_div.outerHTML;

	$('input[type="radio"]').on('click', function () {
		let val = $(this).attr('id');
		localStorage.setItem('particles', val);
	})

	$('input[type="range"]').on('mouseup', function () {
		let id = $(this).attr('id');
		let val = $(this).val();
		localStorage.setItem(id + '-volume', val);
	});

	var particle_quality = localStorage.getItem('particles') ?? 'high';
	$('#' + particle_quality).prop('checked', true);

	$('#master').val(localStorage.getItem('master-volume') ?? 100);
    $('#game').val(localStorage.getItem('game-volume') ?? 100);
    $('#music').val(localStorage.getItem('music-volume') ?? 100);

	return ;
};