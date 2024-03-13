import home from "./home.js";
import login from "./login.js";
import menu from "./menu.js";
import vsai from "./vs-ai.js";
import vsplayer from "./vs-player.js";
import game from "./game.js";
import settings from "./settings.js";
import dashboard from "./dashboard.js";



const routes = {
	"/": { title: "Ding Dong", render: home },
	"/login": { title: "Login with 42", render: login },
	"/menu": { title: "Menu", render: menu },
	"/vs-ai": { title: "VS AI", render: vsai },
	"/vs-player": { title: "VS Player", render: vsplayer},
	"/game": { title: "Game", render: game },
	"/settings": { title: "Settings", render: settings },
	"/dashboard": { title: "Dashboard", render: dashboard },
};

export function loadCSS(href) {
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
}

export function lightenColor(color, percent) {
	color = color.replace('#', '');

	const r = parseInt(color.substr(0, 2), 16);
	const g = parseInt(color.substr(2, 2), 16);
	const b = parseInt(color.substr(4, 2), 16);

	const newR = Math.round(r + (255 - r) * percent / 100);
	const newG = Math.round(g + (255 - g) * percent / 100);
	const newB = Math.round(b + (255 - b) * percent / 100);

	const newColorHex = [
	newR.toString(16).padStart(2, '0'),
	newG.toString(16).padStart(2, '0'),
	newB.toString(16).padStart(2, '0')
	].join('');

	return `#${newColorHex}`;
}

function initRedirClicks(e) {
	const parent = e.target.closest("[data-link]");
	if (parent) {
		e.preventDefault();
		history.pushState("", "", parent.getAttribute("data-link"));
		router();
	}
}

export function navigate(path) {
	if (window.location.pathname === path) {
		return;
	}

	history.pushState({}, "", path);
	router();
}

export function router() {
	let view = routes[location.pathname];

	if (view) {
		document.title = view.title;
		app.innerHTML = view.render();
	}
	else {
		history.replaceState("", "", "/");
		router();
	}
};

window.addEventListener("click", initRedirClicks);
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

localStorage.setItem('palette', 'iykyk');