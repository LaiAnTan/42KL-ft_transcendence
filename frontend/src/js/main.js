import home from "./home.js";
import login from "./login.js";
import menu from "./menu.js";

const routes = {
	"/": { title: "ft_transcendence", render: home },
	"/login": { title: "Login with 42", render: login },
	"/menu": { title: "Menu", render: menu }
};

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
	if (e.target.matches("[data-link]")) {
		e.preventDefault();
		history.pushState("", "", e.target.href);
		router();
	}
});

// Update router
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);