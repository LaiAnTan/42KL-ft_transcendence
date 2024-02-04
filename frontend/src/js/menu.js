export default () => {
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
