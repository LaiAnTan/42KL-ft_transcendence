import { loadCSS, router } from "./main.js"

export default () => {
	loadCSS("src/css/dashboard.css");

	/* Get querystring from URL ( url?var1=something&var2=123 ) */
	const queryString = window.location.search;
	
	/* If no query string, user must be on the search page */
	if (!queryString) {
		var inputVal = '';

		/* Update the inputval variable on every handleInputChange call */
		const handleInputChange = (e) => {
			inputVal = e.target.value;
			console.log(inputVal);
			submitButton.dataset.link = `/dashboard?username=${inputVal}`;
		};

		/* #app is the div we are constantly updating in index.html */
		let app = document.querySelector('#app');

		/* We create a new div, give it ID #app, give it the same styling as the original #app */
		const new_div = document.createElement('div');
		new_div.setAttribute('id', 'app');
		new_div.className = 'w-100 h-100';
		/* Specify the new HTML we want to show */
		new_div.innerHTML = `
<button data-link="/menu" type="button" class="go-back-button scale-up ml-4" style="z-index: 1">
	<p class="description scale-up cursor-pointer">GO BACK</p>
</button>
<div class="d-flex flex-column align-items-center justify-content-center h-100">
	<div class="important-label" style="font-size: 50px;">USER DASHBOARD</div>
	<div class="p-4" style="width: 500px">
		<form>
			<div class="input-container">
				<input id="searchbox" type="text" placeholder="Search by Intra ID" class="description input-box" />
				<button data-link="/dashboard?username=" id="searchbutton" type="submit"><img src="../src/assets/search.png" style="width: 32px; height: 32px;"></img></button>
			</div>
		</form>
	</div>
</div>`;
		/* Replace the original #app's entire HTML with the new #app */
		app.outerHTML = new_div.outerHTML;
		
		/* The entire reason we create a new #app is to be able to hook event listener to specified element IDs */
		let ptr_app = document.querySelector('#app');
		/* Text input field ~ like Display Name input box */
		const inputField = ptr_app.querySelector('#searchbox');
		/* Apply button ~ like Save button */
		const submitButton = ptr_app.querySelector('#searchbutton');
		/* Listen for any input change on the #searchbox input field, and call handleInputChange */
		inputField.addEventListener('input', handleInputChange);

		return ;
	}

	const params = {};
	const paramPairs = queryString.slice(1).split('&');
	for (const pair of paramPairs) {
		const [key, val] = pair.split('=');
		params[key] = val;
	}

	/* This is the function that GETs the user details from our Postgres DB through API ( /api/getUser ) */
	const getUser = async () => {
		try {
			const response = await fetch(`http://localhost:8000/api/getUser?username=${params['username']}`, {
				method: 'GET'
			});

			if (response.ok) {
				const data = await response.json();

				/* API returns username: '' when the requested user is not found */
				if (data.username == '') {
					let app = document.querySelector('#app');
					const new_div = document.createElement('div');
					new_div.setAttribute('id', 'app');
					new_div.className = 'w-100 h-100';
					new_div.innerHTML = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/menu" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex align-items-center justify-content-center h-100">
	<div class="important-label" style="font-size: 50px;">User ${params['username']} does not exist.</div>
</div>`;
					app.outerHTML = new_div.outerHTML;
					return ;
				}

				/* Force a change of the URL to /dashboard?username=_username_,
					to avoid any page reloads sending a GET to Postgres again,
					due to loading=true present in querystring */
				history.replaceState("", "", `/dashboard?username=${params['username']}`);

				/* Get name of the active user */
				const current_user = sessionStorage.getItem('username');

				let app = document.querySelector('#app');
				const new_div = document.createElement('div');
				new_div.setAttribute('id', 'app');
				new_div.className = 'w-100 h-100';
				let ret = `
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 8vh; z-index: 1">
	<p data-link="/menu" class="description scale-up cursor-pointer">GO BACK</p>
</div>
<div class="d-flex flex-row align-items-center justify-content-around h-100" style="padding: 50px 0;">
	<div class="d-flex flex-column rounded-border glowing-border h-100 w-100 mx-3" style="min-width: 400px; max-width:600px;">
		<div class="p-4">
			<div class="important-label">Game History</div>
			<div class="description cursor-pointer">Button to redirect</div>
		</div>
	</div>
	<div class="d-flex flex-column align-items-center justify-content-center h-100 w-100" style="min-width: 200px; max-width:250px;">
		<div class="profile-pic" style="position: relative">
			<img src="${"http://localhost:8000/api" + data.profile_pic}" style="z-index: 0; position: absolute" />
			${current_user == data.username ? '<img src="/src/assets/wojak-point.png" style="z-index: 1; opacity: 85%" />' : ''}
		</div>
		<div class="important-label" style="font-size: 40px;">${data.username.toUpperCase()}</div>
	</div>
	<div class="d-flex flex-column justify-content-between rounded-border glowing-border h-100 w-100 mx-3" style="min-width: 400px; max-width:600px;">
		<div class="flex-grow-1" style="overflow-y: auto">
			<div class="px-4 py-2">
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
			<div class="px-4 py-2">
				<div class="important-label">User Info</div>
				<div class="d-table description w-100 pt-2 px-4">
					<div class="d-table-row my-2">
						<div class="d-table-cell">Display Name</div>
						${current_user == data.username ? /* Ternary here used to check if active user is the user being displayed. If yes, show input box */
							`<div class="d-table-cell input-container"><input id="new-display-name" type="text" placeholder="Edit display name" class="description" value="${data.display_name}" /></div>`
							: `<div class="d-table-cell p-0">${data.display_name}</div>`
						}
					</div>
					${current_user == data.username ?
						`<div class="d-table-row">
							<div class="d-table-cell">Avatar</div>
							<div class="d-table-cell input-container"><input id="new-avatar" type="file" accept="image/jpeg, image/png, image/jpg" /></div>
						</div>`
							: ``
					}
					<div class="d-table-row pt-3">
						<div class="d-table-cell">Email</div>
						<div class="d-table-cell">${data.email}</div>
					</div>
				</div>
			</div>
		</div>

		${current_user == data.username ? /* Ternary here used to check if active user is the user being displayed. If yes, show save button */
		`<div class="d-flex flex-row align-items-center justify-content-between border-top px-4 py-2">
			<div class="description">Editable</div>
			<button id="update-button" type="submit" class="description rounded-border cursor-pointer p-2" style="background-color: green">Save</button>
		</div>` : ''}
	</div>
</div>`;
				new_div.innerHTML = ret;
				app.outerHTML = new_div.outerHTML;

				$('#update-button').click(function() {
					var newDisplayName = $('#new-display-name').val();
					var newAvatar = $('#new-avatar')[0].files.length > 0 ? $('#new-avatar')[0].files[0] : null;
					var form_data = new FormData();

					form_data.append("display_name", newDisplayName)
					if (newAvatar !== null) {
						if (newAvatar.size / 1024 > 50) {
							alert("Image size too large.");
							return ;
						}
						form_data.append("profile_pic", newAvatar)
					}

					let oldDisplayName = sessionStorage.getItem('display_name');
					if (newDisplayName == oldDisplayName && newAvatar == null)
						return ;

					$.ajax({
						url: `http://localhost:8000/api/editUser?username=${params['username']}`,
						type: 'POST',
						contentType: 'multipart/form-data',
						data: form_data,
						contentType: false,
						processData: false,
						success: function(response) {
							alert("Details updated!");
							sessionStorage.setItem('display_name', response.display_name);
							sessionStorage.setItem('profile_pic', 'http://localhost:8000/api' + response.profile_pic);
							history.replaceState("", "", `/dashboard?username=${params['username']}`);
							router();
						},
						error: function(jqXHR, textStatus, errorThrown) {
							alert("Failed to update, fucking noob");
							console.error('Error updating details:', jqXHR.responseJSON);
						}
					});
				})

				return ;
			} else {
				console.error(error);
			}
		} catch (error) {
		  console.error('Error sending code:', error);
		}
	};

	getUser();

	let app = document.querySelector('#app');
	const new_div = document.createElement('div');
	new_div.setAttribute('id', 'app');
	new_div.className = 'w-100 h-100';
	new_div.innerHTML = `
<div class="d-flex align-items-center justify-content-center h-100">
<div class="important-label" style="font-size: 50px;">Searching for user ${params['username']} </div>
</div>`;
	app.outerHTML = new_div.outerHTML;

	return ;
}
