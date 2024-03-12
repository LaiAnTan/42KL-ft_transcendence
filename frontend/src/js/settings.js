import { loadCSS, lightenColor } from "./main.js";

export default () => {
	loadCSS("src/css/settings.css");

	let config_palette = localStorage.getItem("palette");
	let color1 = `--${config_palette}-1`;
	let color2 = `--${config_palette}-2`;
	let color3 = `--${config_palette}-3`;
	let color4 = `--${config_palette}-4`;
	let color5 = `--${config_palette}-5`;

	let app = document.querySelector('#app');
	const new_div = document.createElement('div');
	new_div.setAttribute('id', 'app');
	new_div.className = 'vw-100 v-100';
	new_div.innerHTML = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="menu-header unselectable" style="height: 8vh; z-index: 0 background: linear-gradient(to bottom, var(${color5}), transparent)">
	<p class="text-center menu-header-title h-100 m-0 pt-2" style="text-shadow: 0 0 25px var(${color5})">SETTINGS</p>
</div>
<div class="unselectable" style="height: 92vh;">
	<div class="d-flex align-items-center justify-content-center h-100">
		<div class="d-flex flex-column align-items-center justify-content-center mx-4 w-100" style="min-width: 800px; max-width: 1300px; height: 700px">
			<!-- graphics settings -->
			<div class="border-left border-right h-100 w-50 p-4">
				<p class="important-label">GRAPHICS</p>
				<p class="description">Changes the particle effects</p>
				<div class="px-3 py-1">
					<div class="d-flex flex-row justify-content-space-evenly pt-1">
						<div class="px-1">
							<input type="radio" id="off" name="options" class="visually-hidden" />
							<label for="off" class="button-like description scale-up rounded-border cursor-pointer" onmouseover="this.style.boxShadow='0 0 40px var(${color5})'" onmouseout="this.style.boxShadow='none'">OFF</label>
						</div>
						<div class="px-1">
							<input type="radio" id="low" name="options" class="visually-hidden" checked />
							<label for="low" class="button-like description scale-up rounded-border cursor-pointer" onmouseover="this.style.boxShadow='0 0 40px var(${color5})'" onmouseout="this.style.boxShadow='none'">LOW</label>
						</div>
						<div class="px-1">
							<input type="radio" id="high" name="options" class="visually-hidden" />
							<label for="high" class="button-like description scale-up rounded-border cursor-pointer" onmouseover="this.style.boxShadow='0 0 40px var(${color5})'" onmouseout="this.style.boxShadow='none'">HIGH</label>
						</div>
					</div>
				</div>
			</div>

			<div class="border-left border-right h-100 w-50 p-4">
				<p class="important-label">AUDIO</p>
				<p class="description">Adjust sound volumes</p>
				<div class="px-3 py-1">
					<div class="pt-1">
						<p class="description pb-4">Master</p>
						<input type="range" id="master" name="master" min="0" max="100" value="100" class="mx-auto w-100" style="min-width: 300px; max-width: 400px" />
					</div>
					<div class="pt-4">
						<p class="description pb-4">Game</p>
						<input type="range" id="game" name="game" min="0" max="100" value="100" class="mx-auto w-100" style="min-width: 300px; max-width: 400px" />
					</div>
					<div class="pt-4">
						<p class="description pb-4">Effects</p>
						<input type="range" id="effects" name="effects" min="0" max="100" value="100" class="mx-auto w-100" style="min-width: 300px; max-width: 400px" />
					</div>
				</div>
			</div>

		</div>
	</div>
</div>`;
	app.outerHTML = new_div.outerHTML;
};