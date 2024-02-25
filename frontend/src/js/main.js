import home from "./home.js";
import login from "./login.js";
import menu from "./menu.js";
import vsai from "./vs-ai.js";
import vsplayer from "./vs-player.js";
import game from "./game.js";
import settings from "./settings.js";

const app = document.getElementById("app");
const routes = {
	"/": { title: "Ding Dong", render: home },
	"/login": { title: "Login with 42", render: login },
	"/menu": { title: "Menu", render: menu },
	"/vs-ai": { title: "VS AI", render: vsai },
	"/vs-player": { title: "VS Player", render: vsplayer},
	"/game": { title: "Game", render: game },
	"/settings": { title: "Settings", render: settings }
};

export function loadCSS(href) {
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
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

// Handle navigation
window.addEventListener("click", e => {
	console.log(e.target);
	if (e.target.matches("[data-link]")) {
		console.log(e.target.getAttribute("data-link"));
		e.preventDefault();
		history.pushState("", "", e.target.getAttribute("data-link"));
		router();
	}
});

// Update router
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);