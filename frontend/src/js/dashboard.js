import { loadCSS, router } from "./main.js"

export default () => {
	loadCSS("src/css/dashboard.css");

	const queryString = window.location.search;
	if (!queryString) {
		const ret = `
<div class="important-label" style="font-size: 50px;">USER DASHBOARD</div>
<div class="p-4" style="width: 500px">
	<form>
		<div class="search-bar">
			<input id="searchbox" type="text" placeholder="Search by Intra ID" class="description" />
			<button data-link="/dashboard?username=" id="searchbutton" type="submit"><img src="../src/assets/search.png" style="width: 32px; height: 32px;"></img></button>
		</div>
	</form>
</div>`
		
		let inputVal = ''

		const handleInputChange = (e) => {
			inputVal = e.target.value;
			submitButton.dataset.link = `/dashboard?username=${inputVal}&loading=true`;
		};

		const container = document.createElement('div');
		container.className = 'd-flex flex-column align-items-center justify-content-center vh-100';
		container.innerHTML = ret;
		document.body.appendChild(container);

		const inputField = container.querySelector('#searchbox');
		const submitButton = container.querySelector('#searchbutton');
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
				console.log('User found.')
				console.log(response)
				history.replaceState("", "", `/dashboard?username=${params['username']}`);
				router();
			} else {
				return `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/dashboard" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">User ${params['username']} does not exist.</div>
</div>`;
			}
		} catch (error) {
		  console.error('Error sending code:', error);
		}
	};
	if (queryString.includes('loading=true')) {
		getUser();
		return `
<div class="d-flex align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">Searching for user ${params['username']} </div>
</div>`;
	}

	return `
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
		<div class="circle"></div>
		<div class="important-label" style="font-size: 40px;">${params['username'].toUpperCase()}</div>
	</div>
	<div class="d-flex flex-column justify-content-between rounded-border glowing-border h-100 w-100 mx-3" style="min-width: 400px; max-width:600px;">
		<div>
			<!-- Public data -->
			<div class="p-4">
				<div class="important-label">User Info</div>
				<div class="d-table description w-100 pt-2 px-4">
					<div class="d-table-row">
						<div class="d-table-cell">Display Name</div>
						<div class="d-table-cell" title="Hong You">Hong You</div>
					</div>
					<div class="d-table-row">
						<div class="d-table-cell">Email</div>
						<div class="d-table-cell" title="someone@gmail.com">someone@gmail.com</div>
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
</div>
	`
}