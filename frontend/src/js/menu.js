export default () => {
<<<<<<< HEAD
  return `
    <div class="menu-header">
      <h1>MAIN MENU</h1>
    </div>
    <div class="menu-content">
      <div class="menu-component vs-player">
        <div class="menu-component-title">VS PLAYER</div>
        <div class="menu-component-description">PLAY AGAINST OTHER PLAYERS</div>
      </div>
      <div class="menu-component vs-ai">
        <div class="menu-component-title">VS AI</div>
        <div class="menu-component-description">PLAY 1V1 AGAINST AN AI</div>
      </div>
      <div class="menu-component tournament">
        <div class="menu-component-title">TOURNAMENT</div>
        <div class="menu-component-description">BRACKET-STYLED TOURNAMENT</div>
      </div>
    </div>
  `;
};
=======
	let img = document.createElement('img');
	img.src = "../assets/settings.svg";
	document.body.appendChild(img);

	return `
		<div class="menu-header">
		<h1>MAIN MENU</h1>
		<img src="./../assets/settings.svg" alt="Setting">
		</div>
	`;
};
>>>>>>> 5458dc22d0a1589823ec34b8ec6c996d09200169
