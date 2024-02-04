export default () => {
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
