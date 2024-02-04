export default () => {
return `
<div class="menu-header unselectable" style="height: 8vh">
	<p class="h-100 m-0 text-center pt-2" style="font-family: 'Ubuntu', sans-serif; font-size: 40px; color: white; font-weight: 700; text-shadow: 0 0 25px #85EBE9; width: 100vw;">MAIN MENU</p>
</div>
<div class="d-flex flex-column align-items-center justify-content-around pt-4 pb-4 unselectable" style="height: 92vh">
	<div id="vs-player" class="menu-component vs-player cursor-pointer">
		<div class="menu-component-title">VS PLAYER</div>
		<div class="menu-component-description">PLAY AGAINST OTHER PLAYERS</div>
	</div>
	<div id="vs-ai" class="menu-component vs-ai cursor-pointer">
		<div class="menu-component-title">VS AI</div>
		<div class="menu-component-description">PLAY 1V1 AGAINST AN AI</div>
	</div>
	<div id="tourney" class="menu-component tournament cursor-pointer">
		<div class="menu-component-title">TOURNAMENT</div>
		<div class="menu-component-description">BRACKET-STYLED TOURNAMENT</div>
	</div>
</div>
`;
};
