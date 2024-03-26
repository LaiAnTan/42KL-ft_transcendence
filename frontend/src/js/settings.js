import { loadCSS, resetCSS } from "./main.js";

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
	<div class="menu-header unselectable" style="height: 110px">
		<p class="text-center menu-header-title h-100 my-4" style="text-shadow: 0 0 25px var(--color5)">SETTINGS</p>
	</div>
	<div class="d-flex justify-content-center align-items-center important-label unselectable position-absolute mr-4" style="top: 0; right: 0; height: 110px; z-index: 1">
		<p id="sign-out-button" class="description scale-up cursor-pointer mr-4">SIGN OUT</p>
	</div>
	<div class="d-flex justify-content-center unselectable" style="overflow-y: auto">
		<div class="d-flex flex-column m-4 w-50" style="min-width: 400px; max-width: 650px">

			<div class="border-left border-right w-100 p-4">
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

			<div class="border-left border-right w-100 p-4">
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
			
			<div class="border-left border-right w-100 p-4">
				<p class="important-label">THEME</p>
				<p class="description">Customise UI colours</p>
				<div class="d-flex flex-column rounded-border w-100">
				<div class="border-bottom w-100"><p id="current-theme-text" class="p-2 description">Current theme: <b><i>${localStorage.getItem("palette")}</b></i></p></div>
				<div id="palette" class="d-flex grid-container w-100" style="max-height: 500px;">
					<div class="flex-grow-1" style="overflow-y: auto">
						<div class="mx-4 my-3">
							<p class="description">Default</p>
							<div class="color-button button-like rounded-border theme-picker" id="default">
								<div class="color-column" style="background-color: var(--default-1);"></div>
								<div class="color-column" style="background-color: var(--default-2);"></div>
								<div class="color-column" style="background-color: var(--default-3);"></div>
								<div class="color-column" style="background-color: var(--default-4);"></div>
								<div class="color-column" style="background-color: var(--default-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Ding's Dazzle</p>
							<div class="color-button button-like rounded-border theme-picker" id="dings-dazzle">
								<div class="color-column" style="background-color: var(--dings-dazzle-1);"></div>
								<div class="color-column" style="background-color: var(--dings-dazzle-2);"></div>
								<div class="color-column" style="background-color: var(--dings-dazzle-3);"></div>
								<div class="color-column" style="background-color: var(--dings-dazzle-4);"></div>
								<div class="color-column" style="background-color: var(--dings-dazzle-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Ding's Delight</p>
							<div class="color-button button-like rounded-border theme-picker" id="dings-delight">
								<div class="color-column" style="background-color: var(--dings-delight-1);"></div>
								<div class="color-column" style="background-color: var(--dings-delight-2);"></div>
								<div class="color-column" style="background-color: var(--dings-delight-3);"></div>
								<div class="color-column" style="background-color: var(--dings-delight-4);"></div>
								<div class="color-column" style="background-color: var(--dings-delight-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Electric Dream</p>
							<div class="color-button button-like rounded-border theme-picker" id="electric-dream">
								<div class="color-column" style="background-color: var(--electric-dream-1);"></div>
								<div class="color-column" style="background-color: var(--electric-dream-2);"></div>
								<div class="color-column" style="background-color: var(--electric-dream-3);"></div>
								<div class="color-column" style="background-color: var(--electric-dream-4);"></div>
								<div class="color-column" style="background-color: var(--electric-dream-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Laser Lemonade</p>
							<div class="color-button button-like rounded-border theme-picker" id="laser-lemonade">
								<div class="color-column" style="background-color: var(--laser-lemonade-1);"></div>
								<div class="color-column" style="background-color: var(--laser-lemonade-2);"></div>
								<div class="color-column" style="background-color: var(--laser-lemonade-3);"></div>
								<div class="color-column" style="background-color: var(--laser-lemonade-4);"></div>
								<div class="color-column" style="background-color: var(--laser-lemonade-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Citrus Surge</p>
							<div class="color-button button-like rounded-border theme-picker" id="citrus-surge">
								<div class="color-column" style="background-color: var(--citrus-surge-1);"></div>
								<div class="color-column" style="background-color: var(--citrus-surge-2);"></div>
								<div class="color-column" style="background-color: var(--citrus-surge-3);"></div>
								<div class="color-column" style="background-color: var(--citrus-surge-4);"></div>
								<div class="color-column" style="background-color: var(--citrus-surge-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Neon Bliss</p>
							<div class="color-button button-like rounded-border theme-picker" id="neon-bliss">
								<div class="color-column" style="background-color: var(--neon-bliss-1);"></div>
								<div class="color-column" style="background-color: var(--neon-bliss-2);"></div>
								<div class="color-column" style="background-color: var(--neon-bliss-3);"></div>
								<div class="color-column" style="background-color: var(--neon-bliss-4);"></div>
								<div class="color-column" style="background-color: var(--neon-bliss-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Radiant Rebellion</p>
							<div class="color-button button-like rounded-border theme-picker" id="radiant-rebellion">
								<div class="color-column" style="background-color: var(--radiant-rebellion-1);"></div>
								<div class="color-column" style="background-color: var(--radiant-rebellion-2);"></div>
								<div class="color-column" style="background-color: var(--radiant-rebellion-3);"></div>
								<div class="color-column" style="background-color: var(--radiant-rebellion-4);"></div>
								<div class="color-column" style="background-color: var(--radiant-rebellion-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Vivid Voltage</p>
							<div class="color-button button-like rounded-border theme-picker" id="vivid-voltage">
								<div class="color-column" style="background-color: var(--vivid-voltage-1);"></div>
								<div class="color-column" style="background-color: var(--vivid-voltage-2);"></div>
								<div class="color-column" style="background-color: var(--vivid-voltage-3);"></div>
								<div class="color-column" style="background-color: var(--vivid-voltage-4);"></div>
								<div class="color-column" style="background-color: var(--vivid-voltage-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Ruby Radiance</p>
							<div class="color-button button-like rounded-border theme-picker" id="ruby-radiance">
								<div class="color-column" style="background-color: var(--ruby-radiance-1);"></div>
								<div class="color-column" style="background-color: var(--ruby-radiance-2);"></div>
								<div class="color-column" style="background-color: var(--ruby-radiance-3);"></div>
								<div class="color-column" style="background-color: var(--ruby-radiance-4);"></div>
								<div class="color-column" style="background-color: var(--ruby-radiance-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Cerulean Spectra</p>
							<div class="color-button button-like rounded-border theme-picker" id="cerulean-spectra">
								<div class="color-column" style="background-color: var(--cerulean-spectra-1);"></div>
								<div class="color-column" style="background-color: var(--cerulean-spectra-2);"></div>
								<div class="color-column" style="background-color: var(--cerulean-spectra-3);"></div>
								<div class="color-column" style="background-color: var(--cerulean-spectra-4);"></div>
								<div class="color-column" style="background-color: var(--cerulean-spectra-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Jade Jubilee</p>
							<div class="color-button button-like rounded-border theme-picker" id="jade-jubilee">
								<div class="color-column" style="background-color: var(--jade-jubilee-1);"></div>
								<div class="color-column" style="background-color: var(--jade-jubilee-2);"></div>
								<div class="color-column" style="background-color: var(--jade-jubilee-3);"></div>
								<div class="color-column" style="background-color: var(--jade-jubilee-4);"></div>
								<div class="color-column" style="background-color: var(--jade-jubilee-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Magenta Magic</p>
							<div class="color-button button-like rounded-border theme-picker" id="magenta-magic">
								<div class="color-column" style="background-color: var(--magenta-magic-1);"></div>
								<div class="color-column" style="background-color: var(--magenta-magic-2);"></div>
								<div class="color-column" style="background-color: var(--magenta-magic-3);"></div>
								<div class="color-column" style="background-color: var(--magenta-magic-4);"></div>
								<div class="color-column" style="background-color: var(--magenta-magic-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Sunset Glow</p>
							<div class="color-button button-like rounded-border theme-picker" id="sunset-glow">
								<div class="color-column" style="background-color: var(--sunset-glow-1);"></div>
								<div class="color-column" style="background-color: var(--sunset-glow-2);"></div>
								<div class="color-column" style="background-color: var(--sunset-glow-3);"></div>
								<div class="color-column" style="background-color: var(--sunset-glow-4);"></div>
								<div class="color-column" style="background-color: var(--sunset-glow-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Dusk Horizon</p>
							<div class="color-button button-like rounded-border theme-picker" id="dusk-horizon">
								<div class="color-column" style="background-color: var(--dusk-horizon-1);"></div>
								<div class="color-column" style="background-color: var(--dusk-horizon-2);"></div>
								<div class="color-column" style="background-color: var(--dusk-horizon-3);"></div>
								<div class="color-column" style="background-color: var(--dusk-horizon-4);"></div>
								<div class="color-column" style="background-color: var(--dusk-horizon-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Iykyk</p>
							<div class="color-button button-like rounded-border theme-picker" id="iykyk">
								<div class="color-column" style="background-color: var(--iykyk-1);"></div>
								<div class="color-column" style="background-color: var(--iykyk-2);"></div>
								<div class="color-column" style="background-color: var(--iykyk-3);"></div>
								<div class="color-column" style="background-color: var(--iykyk-4);"></div>
								<div class="color-column" style="background-color: var(--iykyk-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Unicorn Vomit</p>
							<div class="color-button button-like rounded-border theme-picker" id="unicorn-vomit">
								<div class="color-column" style="background-color: var(--unicorn-vomit-1);"></div>
								<div class="color-column" style="background-color: var(--unicorn-vomit-2);"></div>
								<div class="color-column" style="background-color: var(--unicorn-vomit-3);"></div>
								<div class="color-column" style="background-color: var(--unicorn-vomit-4);"></div>
								<div class="color-column" style="background-color: var(--unicorn-vomit-5);"></div>
							</div>
						</div>
						<div class="mx-4 my-3">
							<p class="description">Eyesore</p>
							<div class="color-button button-like rounded-border theme-picker" id="eyesore">
								<div class="color-column" style="background-color: var(--eyesore-1);"></div>
								<div class="color-column" style="background-color: var(--eyesore-2);"></div>
								<div class="color-column" style="background-color: var(--eyesore-3);"></div>
								<div class="color-column" style="background-color: var(--eyesore-4);"></div>
								<div class="color-column" style="background-color: var(--eyesore-5);"></div>
							</div>
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
	app.outerHTML = new_div.outerHTML;

	$('#sign-out-button').click(function () {
		sessionStorage.clear();
		localStorage.clear();
		window.history.pushState("", "", "/");
		window.location.reload();
	});

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

	$('.theme-picker').on('click', function () {
		let colour = $(this).attr('id');
		let curr = localStorage.getItem('palette');

		if (colour != curr) {
			localStorage.setItem('palette', colour);
			resetCSS();
			$('#current-theme-text').html(`Current theme: <b><i>${colour}</i></b>`);
			loadCSS("src/css/palettes/" + colour + ".css");
			loadCSS("src/css/settings.css");
		}
	});

	return ;
};