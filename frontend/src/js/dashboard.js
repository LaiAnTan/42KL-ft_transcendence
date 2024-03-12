import { loadCSS, router } from "./main.js"

export default () => {
	loadCSS("src/css/dashboard.css");

	const queryString = window.location.search;
	if (!queryString) {
		let inputVal = '';

		const handleInputChange = (e) => {
			inputVal = e.target.value;
			submitButton.dataset.link = `/dashboard?username=${inputVal}&loading=true`;
		};

		let app = document.querySelector('#app');
		const new_div = document.createElement('div');
		new_div.setAttribute('id', 'app');
		new_div.className = 'vw-100 v-100';
		new_div.innerHTML = `
<div class="d-flex flex-column align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">USER DASHBOARD</div>
	<div class="p-4" style="width: 500px">
		<form>
			<div class="search-bar">
				<input id="searchbox" type="text" placeholder="Search by Intra ID" class="description" />
				<button data-link="/dashboard?username=" id="searchbutton" type="submit"><img src="../src/assets/search.png" style="width: 32px; height: 32px;"></img></button>
			</div>
		</form>
	</div>
</div>`;
		app.outerHTML = new_div.outerHTML;
		
		let ptr_app = document.querySelector('#app');
		const inputField = ptr_app.querySelector('#searchbox');
		const submitButton = ptr_app.querySelector('#searchbutton');
		inputField.addEventListener('input', handleInputChange);

		return ;
	}

	/* If have query string means it is searching / has found user */
	const params = {};
	const paramPairs = queryString.slice(1).split('&');
	for (const pair of paramPairs) {
		const [key, val] = pair.split('=');
		params[key] = val;
	}

	const getUser = async () => {
		try {
			const response = await fetch(`http://localhost:8000/api/getUser?username=${params['username']}`, {
				method: 'GET'
			});

			if (response.ok) {
				const data = await response.json();

				if (data.username == '') {
					console.log('here');

					let app = document.querySelector('#app');
					const new_div = document.createElement('div');
					new_div.setAttribute('id', 'app');
					new_div.className = 'vw-100 vh-100';
					new_div.innerHTML = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/dashboard" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">User ${params['username']} does not exist.</div>
</div>`;
					app.outerHTML = new_div.outerHTML;
					return ;
				}

				console.log('User found.');
				console.log(data);
				history.replaceState("", "", `/dashboard?username=${params['username']}`);

				let app = document.querySelector('#app');
				const new_div = document.createElement('div');
				new_div.setAttribute('id', 'app');
				new_div.className = 'vw-100 vh-100';
				new_div.innerHTML = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/dashboard" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex flex-row align-items-center justify-content-around vh-100" style="padding: 50px 0;">
	<div class="d-flex flex-column rounded-border glowing-border h-100 w-100 mx-3" style="min-width: 400px; max-width:600px;">
		<!-- Game Statistics -->
		<div class="p-4">
			<div class="important-label">Game Statistics</div>
			<div class="d-table description w-100 pt-2 px-4">
				<div class="d-table-row">
					<div class="d-table-cell">Games Played</div>
					<div class="d-table-cell">0</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Games Won</div>
					<div class="d-table-cell">0</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Games Lost</div>
					<div class="d-table-cell">0</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Win Rate</div>
					<div class="d-table-cell">0%</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Best Score</div>
					<div class="d-table-cell">0</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Average Score</div>
					<div class="d-table-cell">0</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Current Streak</div>
					<div class="d-table-cell">0</div>
				</div>
				<div class="d-table-row">
					<div class="d-table-cell">Longest Streak</div>
					<div class="d-table-cell">0</div>
				</div>
			</div>
		</div>
		<!-- Game History -->
		<div class="p-4">
			<div class="important-label">Game History</div>
			<div class="description cursor-pointer">Button to redirect</div>
		</div>
	</div>
	<div class="d-flex flex-column align-items-center justify-content-center h-100 w-100" style="min-width: 200px; max-width:250px;">
		<div class="profile-pic">
			<img src="${data.profile_pic}" />
		</div>
		<div class="important-label" style="font-size: 40px;">${data.username.toUpperCase()}</div>
	</div>
	<div class="d-flex flex-column justify-content-between rounded-border glowing-border h-100 w-100 mx-3" style="min-width: 400px; max-width:600px;">
		<div>
			<!-- Public data -->
			<div class="p-4">
				<div class="important-label">User Info</div>
				<div class="d-table description w-100 pt-2 px-4">
					<div class="d-table-row">
						<div class="d-table-cell">Display Name</div>
						<div class="d-table-cell">${data.display_name}</div>
					</div>
					<div class="d-table-row">
						<div class="d-table-cell">Email</div>
						<div class="d-table-cell">${data.email}</div>
					</div>
				</div>
			</div>
			<!-- Privaate data -->
			<div class="p-4">
				<div class="important-label">Personal Info</div>
				<div class="d-table description w-100 pt-2 px-4">
					<div class="d-table-row">
						<div class="d-table-cell" title="Two Factor Authentication">2FA</div>
						<div class="d-table-cell">Status</div>
					</div>
				</div>
			</div>
		</div>

		<div class="d-flex flex-row align-items-center justify-content-between p-4">
			<div class="description">Editable</div>
			<div class="description rounded-border cursor-pointer p-2" style="background-color: green;">Save</div>
		</div>
	</div>
</div>`;
				app.outerHTML = new_div.outerHTML;
				return ;
			} else {
				console.error(error);
			}
		} catch (error) {
		  console.error('Error sending code:', error);
		}
	};
	if (queryString.includes('loading=true')) {
		getUser();

		let app = document.querySelector('#app');
		const new_div = document.createElement('div');
		new_div.setAttribute('id', 'app');
		new_div.className = 'vw-100 vh-100';
		new_div.innerHTML = `
<div class="d-flex align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">Searching for user ${params['username']} </div>
</div>`;
		app.outerHTML = new_div.outerHTML;
	}
}