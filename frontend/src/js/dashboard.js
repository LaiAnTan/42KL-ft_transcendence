import { loadCSS } from "./main.js"

export default () => {
	loadCSS("src/css/dashboard.css");

	const queryString = window.location.search;
	if (!queryString) {
		// Something here to v-model the text in search bar, and redirect to that url on button click

		return `
<div class="d-flex flex-column align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">USER DASHBOARD</div>
	<div class="p-4" style="width: 500px">
		<form>
			<div class="search-bar">
				<input type="text" placeholder="Search by Intra ID" class="description" />
				<button data-link="/dashboard?intra=hwong" type="submit"><img src="../src/assets/search.png" style="width: 32px; height: 32px;"></img></button>
			</div>
		</form>
	</div>
</div>
		`
	}
	
	const params = {};
	const paramPairs = queryString.slice(1).split('&');
	
	for (const pair of paramPairs) {
		const [key, val] = pair.split('=');
		params[key] = val;
	}
	
	console.log(params);
	
	// temporary, but this should show error screen if requested ID is not in database
	if (params['intra'] == 'undefined') {
		return `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/dashboard" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex align-items-center justify-content-center vh-100">
	<div class="important-label" style="font-size: 50px;">User does not exist.</div>
</div>
		`
	}

	return `
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
		<div class="important-label" style="font-size: 40px;">${params['intra'].toUpperCase()}</div>
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
						<div class="d-table-cell" title="wonghongyou@gmail.com">wonghongyou@gmail.com</div>
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