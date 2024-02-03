import { navigate } from "./main.js";

export default () => {

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "signin-button") {
      const displayName = document.getElementById("display-name").value;
      console.log("Display Name:", displayName);
      navigate("/menu");
    }
  });

  return `
    <div class="login-title-container">
      <div class="login-title-bg">DING DONG</div>
      <div class="login-title">DING DONG</div>
    </div>
    <div class="login-box">
      <div class="header">
        <h1>WELCOME TO DING DONG</h1>
        <p>The game where you smack balls.</p>
      </div>
      <div>
        <div class="text-box">Enter a display name (optional)</div>
        <input type="text" id="display-name" class="input-box" placeholder="Display name">
      </div>
      <button id="signin-button" class="signin">
        SIGN IN WITH 42
      </button>
    </div>
  `;
};
  