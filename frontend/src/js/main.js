import home from "./home.js";
import login from "./login.js";
import menu from "./menu.js";
import vsai from "./vs-ai.js";
import vsplayer from "./vs-player.js";
import game from "./game.js";
import test from "./test.js";

const routes = {
	"/": { title: "Ding Dong", render: home },
	"/login": { title: "Login with 42", render: login },
	"/menu": { title: "Menu", render: menu },
	"/vs-ai": { title: "VS AI", render: vsai },
	"/vs-player": { title: "VS Player", render: vsplayer},
	"/game": { title: "Game", render: game },
	"/test" : { title: "Test", render: test}
};

const app = document.getElementById("app");

function removeAllEventListeners(element) {
	if (element && element.nodeType === Node.ELEMENT_NODE) {
		element.replaceWith(element.cloneNode(true));
	}
}

export function navigate(path) {
	if (window.location.pathname === path) {
		return;
	}

	// removeAllEventListeners(app);
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
	if (e.target.matches("[data-link]")) {
		e.preventDefault();
		history.pushState("", "", e.target.href);
		router();
	}
});

// Update router
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);