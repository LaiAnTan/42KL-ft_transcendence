import { navigate, loadCSS } from "./main.js";

function game() {
	loadCSS("src/css/game.css");

	let player_1_score = 0;
	let player_2_score = 0;
	let player_1_username = "sealw4ll";
	let player_2_username = "lwilliam";
	let is_animating = false;
	var socket;
	let id = "1"
	var roomID;
	var clientID = 123;

	let isLeftPaddleAnimating = false;
	let isRightPaddleAnimating = false;

	function isJSON(str) {
		try {
			JSON.parse(str);
			return true;
		} catch (e) {
			return false;
		}
	}

	fetch("http://localhost:8000/api/matchmaking?clientID=" + clientID, {
		method: "GET"
	})
	.then(response => response.json())
	.then(data => {
		roomID = data.roomID;
		socket = new WebSocket(`ws://localhost:8000/dong?roomID=${roomID}&clientID=${clientID}`);
		// Set up WebSocket event listeners
		socket.onopen = function(event) {
			console.log("WebSocket connection opened");
			console.log("client", clientID, "joined room", roomID);
		};
		socket.onmessage = function(event) {
			// console.log( "Received message:", event.data);
			if (isJSON(event.data)) {
				let endElement = document.getElementById("dongball");
				let eventData = JSON.parse(event.data);
				if (eventData.console != undefined) {
					console.log(eventData.console);
				}
				if (endElement !== null) {
					tweenBallPosition(endElement, eventData.ball_x, eventData.ball_y, 1);
					tweenPaddlePosition(document.getElementById('paddle_left'), eventData.paddle_left_y, 2);
					tweenPaddlePosition(document.getElementById('paddle_right'), eventData.paddle_right_y, 2);
					if (eventData.hit != undefined) {
						if (eventData.hit == "HIT WALL") {
							playWallSound();
						}
						if (eventData.hit == "HIT LEFT") {
							player_2_score += 1;
							document.getElementById('player2score').textContent = player_2_score.toString();
						}
						if (eventData.hit == "HIT RIGHT") {
							player_1_score += 1;
							document.getElementById('player1score').textContent = player_1_score.toString();
						}
					}
					return ;
				} 
				else {
					console.error("Element with id 'end' not found.");
				}
			}
		};
		socket.onclose = function(event) {
			console.log("WebSocket connection closed");
		};
		socket.onerror = function(event) {
			console.error("WebSocket error:", event);
			console.error("WebSocket connection closed due to room already have 2 players or room not found");
		};
	})
	.catch(error => {
		console.error("Error: ", error);
	});

	function tweenPaddlePosition(element, targetY, duration) {
		let isAnimating = element.classList.contains('paddle-left') ? isLeftPaddleAnimating : isRightPaddleAnimating;
		
		if (isAnimating) {
			return; // Don't start a new animation if one is already in progress
		  }
		  
		  isAnimating = true;
		  
		  const start = { y: parseFloat(element.style.top) || 0 };
		const change = { y: targetY - start.y };
		const startTime = performance.now();
	
		function updateTween() {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(1, elapsed / duration);
	
			const newY = start.y + change.y * progress;
	
			element.style.top = newY + "%";
	
			if (progress < 1) {
				requestAnimationFrame(updateTween);
			} else {
				isAnimating = false; // Animation completed, reset the flag
				if (element.classList.contains('paddle-left')) {
					isLeftPaddleAnimating = false;
				} else {
					isRightPaddleAnimating = false;
				}
			}
		}
	
		requestAnimationFrame(updateTween);
	}

	function tweenBallPosition(element, targetX, targetY, duration) {
		
		if (is_animating) {
		return; // Don't start a new animation if one is already in progress
		}

		is_animating = true;

		const start = { x: parseFloat(element.style.left) || 0, y: parseFloat(element.style.top) || 0 };
		const change = { x: targetX - start.x, y: targetY - start.y };
		const startTime = performance.now();

		function updateTween() {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(1, elapsed / duration);

			const newX = start.x + change.x * progress;
			const newY = start.y + change.y * progress;

			element.style.left = newX + "%";
			element.style.top = newY + "%";

			if (progress < 1) {
				requestAnimationFrame(updateTween);
			} else {
			is_animating = false; // Animation completed, reset the flag
			}
		}

		requestAnimationFrame(updateTween);
	}

	function playWallSound() {
		console.log("SOUNDDDD");
		let beat = new Audio('../src/assets/osu-hit-sound.mp3');
		beat.play();
		// x.play();
	}

	document.addEventListener("click", (event) => {
		if (event.target && event.target.id === "end") {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.close();
			} else {
				console.error("WebSocket connection not established or closed");
			}
		}
		if (event.target && event.target.id === "game") {
			if (socket && socket.readyState === WebSocket.OPEN) {
				let message = {
					"command": "START_GAME",
				};
				socket.send(JSON.stringify(message));
			} else {
				console.error("WebSocket connection not established or closed");
			}
		}
	});

	const pressedKeys = new Set();

	document.addEventListener("keydown", (event) => {
		if (event.key === 'w' || event.key === 's') {
			pressedKeys.add(event.key);
	
			// Determine the direction based on pressed keys
			let direction;
			if (pressedKeys.has('w') && pressedKeys.has('s')) {
				// If both keys are pressed, cancel out the movement
				direction = "PADDLE_STOP";
			} else if (pressedKeys.has('w')) {
				direction = "PADDLE_UP";
			} else if (pressedKeys.has('s')) {
				direction = "PADDLE_DOWN";
			}
	
			if (direction) {
				const message = {
					id: id,
					direction: direction
				};
	
				// Send the WebSocket message
				socket.send(JSON.stringify(message));
			}
		}

		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			pressedKeys.add(event.key);
	
			// Determine the direction based on pressed keys
			let direction;
			if (pressedKeys.has('ArrowUp') && pressedKeys.has('ArrowDown')) {
				// If both keys are pressed, cancel out the movement
				direction = "PADDLE_STOP";
			} else if (pressedKeys.has('ArrowUp')) {
				direction = "PADDLE_UP";
			} else if (pressedKeys.has('ArrowDown')) {
				direction = "PADDLE_DOWN";
			}
	
			if (direction) {
				const message = {
					id: "2",
					direction: direction
				};
	
				// Send the WebSocket message
				socket.send(JSON.stringify(message));
			}
		}
	});
	
	// Keyup event listener
	document.addEventListener("keyup", (event) => {
		if (event.key === 'w' || event.key === 's') {
			pressedKeys.delete(event.key);
	
			// Determine the direction based on remaining pressed keys
			let direction;
			if (pressedKeys.has('w')) {
				direction = "PADDLE_UP";
			} else if (pressedKeys.has('s')) {
				direction = "PADDLE_DOWN";
			} else {
				direction = "PADDLE_STOP";
			}
	
			const message = {
				id: id,
				direction: direction
			};
	
			// Send the WebSocket message
			socket.send(JSON.stringify(message));
		}

		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			pressedKeys.delete(event.key);
	
			// Determine the direction based on remaining pressed keys
			let direction;
			if (pressedKeys.has('ArrowUp')) {
				direction = "PADDLE_UP";
			} else if (pressedKeys.has('ArrowDown')) {
				direction = "PADDLE_DOWN";
			} else {
				direction = "PADDLE_STOP";
			}

			const message = {
				id: "2",
				direction: direction
			};
	
			// Send the WebSocket message
			socket.send(JSON.stringify(message));
		}
	});

	return `
<div class="vw-100 vh-100 p-5">
	<div class="d-flex justify-content-between w-80 mx-auto pb-3">
		<div class="d-flex flex-row player-text player-1-text-color justify-content-end align-items-end">
			<div id=player1score class="player-score-text-size pr-2">${player_1_score.toString()}</div>
			<div id=player1name class="player-username-text-size pb-2">${player_1_username}</div>
		</div>
		<div class="d-flex flex-row player-text player-2-text-color justify-content-end align-items-end">
			<div id=player2name class="player-username-text-size pb-2">${player_2_username}</div>
			<div id=player2score class="player-score-text-size pl-2">${player_2_score.toString()}</div>
		</div>
	</div>
	<div class="game-container mx-auto">
		<div class="game-box w-100">
			<div id="dongball"></div>
			<div id="paddle_left"></div>
			<div id="paddle_right"></div>
			<button id="game">Start Game</button>
			<button id="end">End Websocket</button>
		</div>
	</div>
</div>`;
}

export default game;
