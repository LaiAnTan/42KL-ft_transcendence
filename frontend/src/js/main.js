import home from "./home.js";
import menu from "./menu.js";
import vsai from "./vs-ai.js";
import vsplayer from "./vs-player.js";
import pong from "./pong.js";
import dong from "./dong.js";
import settings from "./settings.js";
import dashboard from "./dashboard.js";
import bracket from "./bracket.js";
import history from "./history.js";
import tournament from "./bracket.js";


const routes = {
	"/": { title: "Ding Dong", render: home },
	"/menu": { title: "Menu", render: menu },
	"/vs-ai": { title: "VS AI", render: vsai },
	"/vs-player": { title: "VS Player", render: vsplayer},
	"/pong": { title: "Pong", render: pong },
	"/dong": { title: "Dong", render: dong },
	"/settings": { title: "Settings", render: settings },
	"/dashboard": { title: "Dashboard", render: dashboard },
	"/bracket": { title: "Bracket", render: bracket },
	"/history": { title: "History", render: history },
	"/tournament": { title: "Tournament", render: bracket },
};

export function loadCSS(href) {
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
}

export function resetCSS() {
	const links = document.querySelectorAll('link[rel="stylesheet"]');
	links.forEach(link => {
		let href = link.getAttribute("href");
		if (href.includes("style.css") || href.includes("bootstrap.min.css")) { return; }
		link.remove();
	});
}

function initRedirClicks(e) {
	const parent = e.target.closest("[data-link]");
	const isProfileContainerClicked = $(e.target).closest('.profile-container').length > 0;

	if (parent && !isProfileContainerClicked) {
		e.preventDefault();
		window.history.pushState("", "", parent.getAttribute("data-link"));
		router();
	}
}

export function navigate(path) {
	if (window.location.pathname === path) {
		return;
	}

	window.history.pushState("", "", path);
	router();
}

export function router() {
	resetCSS();
	let view = routes[location.pathname];

	if (view) {
		if (sessionStorage.getItem('username') === null && location.pathname !== '/' && !location.pathname.includes('/menu')) {
			console.log(sessionStorage.getItem('username'));
			window.history.replaceState("", "", "/");
			view = routes['/'];
		}
		document.title = view.title;
		app.innerHTML = view.render();
	}
	else {
		window.history.replaceState("", "", "/");
		router();
	}
};

function toggleOnlineStatus(event) {
	try {
		let current_user = sessionStorage.getItem('username');

		$.ajax({
			url: `https://localhost:8000/api/setOnlineStatus`,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ "username": current_user ?? asd, "is_online": false }), // Let it throw exception if current_user is null
		});

	} catch (e) { } // Catch and void the exception
	window.removeEventListener('beforeunload', toggleOnlineStatus);
}

window.addEventListener("click", initRedirClicks);
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

window.addEventListener('beforeunload', toggleOnlineStatus);

let color = localStorage.getItem('palette');
localStorage.setItem('palette', color ?? 'default');