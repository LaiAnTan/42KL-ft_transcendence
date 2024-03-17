import { loadCSS, router } from "./main.js";

export default () => {
	loadCSS("src/css/login.css");

	let authConfig = {};

	function signin42() {
		if (!authConfig.clientID || !authConfig.redirectURI) {
			console.log("config missing");
		}

		const { clientID, redirectURI} = authConfig;
		const scopes = 'public';
		const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scopes}`;
		window.location.href = authURL;
	}

	document.addEventListener("click", (event) => {
		if (event.target && event.target.id === "signin-button") {
			console.log("Auth:" , authConfig);
			signin42();
		}
	});

	fetch("http://localhost:8000/api/authConfig")
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			authConfig = data;
		})
		.catch((error) => {
			console.error("Error:", error);
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
	<button id="signin-button" class="signin">
		SIGN IN WITH 42
	</button>
</div>`;
};
