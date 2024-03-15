import { navigate, loadCSS } from "./main.js";

let keydownHandler = null;

export default () => {
	loadCSS("src/css/home.css");
	
	if (!keydownHandler) {
		keydownHandler = (event) => {
			navigate('/login');
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
	<p>Press any key to continue</p>
</div>`;
};