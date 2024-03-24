import { navigate, loadCSS } from "./main.js";

let keydownHandler = null;

export default () => {
	loadCSS("src/css/home.css");
	
	let authConfig = {};

	fetch("https://localhost:8000/api/authConfig")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		authConfig = data;
	})
	.catch((error) => {
		console.error("Error:", error);
	});

	function signin42() {
		if (!authConfig.clientID || !authConfig.redirectURI) {
			console.log("config missing");
		}

		const { clientID, redirectURI} = authConfig;
		const scopes = 'public';
		const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scopes}`;
		window.location.href = authURL;
	}

	if (!keydownHandler) {
		keydownHandler = (event) => {
			signin42();
			document.removeEventListener('keydown', keydownHandler);
			keydownHandler = null;
		};
		document.addEventListener('keydown', keydownHandler);
	}

	return `
<div class="container">
	<div class="title-container">
		<div class="title-bg">DING DONG</div>
		<div class="title">DING DONG</div>
	</div>
	<p>Press any key to sign in</p>
</div>`;
};