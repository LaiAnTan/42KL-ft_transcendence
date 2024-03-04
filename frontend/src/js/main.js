import home from "./home.js";
import login from "./login.js";
import menu from "./menu.js";
import vsai from "./vs-ai.js";
import vsplayer from "./vs-player.js";
import game from "./game.js";
import settings from "./settings.js";
import test from "./test.js";

const app = document.getElementById("app");
const routes = {
	"/": { title: "Ding Dong", render: home },
	"/login": { title: "Login with 42", render: login },
	"/menu": { title: "Menu", render: menu },
	"/vs-ai": { title: "VS AI", render: vsai },
	"/vs-player": { title: "VS Player", render: vsplayer},
	"/game": { title: "Game", render: game },
	"/test" : { title: "Test", render: test},
	"/settings": { title: "Settings", render: settings }
};

export function loadCSS(href) {
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
}

export function initRedirClicks(e) {
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

function router() {
	let view = routes[location.pathname];

	if (view) {
		document.title = view.title;
		app.innerHTML = view.render();
	} else {
		history.replaceState("", "", "/");
		router();
	}
};

window.addEventListener("click", initRedirClicks);
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);