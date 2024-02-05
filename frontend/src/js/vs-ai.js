export default () => {
	return `
<div class="menu-header unselectable" style="height: 8vh">
	<p class="text-center menu-header-title h-100 m-0 pt-2">VS AI</p>
</div>
<div class="d-flex flex-row justify-content-between unselectable" style="height: 92vh; padding: 100px 10%">
	<div class="d-flex flex-column rounded-border w-45 p-3" style="min-width: 500px; min-height: 600px;">
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
	<div class="d-flex flex-column justify-content-between w-45" style="min-width: 500px; min-height: 600px;">
		<div class="d-flex flex-column rounded-border h-85 p-3">
			<p class="important-label">GAME MODE</p>
			<div class="d-flex flex-column justify-content-around mx-auto w-80" style="min-width: 300px; height: 100%">
				<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up mx-2 my-2" style="min-width: 300px; width: 100%;">
					<div class="d-flex flex-row align-items-center">
						<img src="../assets/star-empty.png" alt="Classic" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
						<p class="important-label pl-2" style="font-size: 40px">CLASSIC</p>
					</div>
					<p class="description px-3">KEEP IT CLASSIC</p>
				</div>
				<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up mx-2 my-2" style="min-width: 300px; width: 100%;">
					<div class="d-flex flex-row align-items-center">
						<img src="../assets/star-empty.png" alt="Dong" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
						<p class="important-label pl-2" style="font-size: 40px">DONG</p>
					</div>
					<p class="description px-3">DODGE THE BALLS</p>
				</div>
				<div class="d-flex flex-row justify-content-between align-items-center cursor-pointer scale-up mx-2 my-2" style="min-width: 300px; width: 100%;">
					<div class="d-flex flex-row align-items-center">
						<img src="../assets/star-empty.png" alt="Bong" style="height: 65px; width: 65px; object-fit: cover; object-position: center;">
						<p class="important-label pl-2" style="font-size: 40px">BONG</p>
					</div>
					<p class="description px-3">BRICK BREAKER EDITION</p>
				</div>
			</div>
		</div>
		<div class="rounded-border play-button text-center cursor-pointer ml-auto w-50" style="height: 75px"><p class="important-label">PLAY</p></div>
	</div>
</div>
	`;
};
	