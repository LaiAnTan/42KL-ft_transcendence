import { navigate, loadCSS } from "./main.js";

function game() {
    loadCSS("src/css/game.css");

    let player_1_score = 0;
    let player_2_score = 0;
    let player_1_username = " ";
    let player_2_username = " ";
    let is_animating = false;
    var socket;
    let id = "1"
    var roomID;
    var clientID = sessionStorage.getItem('username');

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

    fetch("http://localhost:8000/api/matchmaking?clientID=" + clientID + "&gameMode=dong", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
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
                if (eventData.room_id && eventData.player_1 && eventData.player_2 && eventData.player_1_score && eventData.player_2_score && eventData.match_type) {
                    console.log("Game ended!");
                    console.log("data:", eventData);
                    fetch(`http://localhost:8000/api/closeRoom?room_code=${eventData.room_id}&gameMode=pong`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .catch(error => {
                        console.error('Error closing room:', error);
                    });
                    socket.close();
                }
                if (eventData.console != undefined) {
                    console.log(eventData.console);
                }
                if (endElement !== null) {
                    if (eventData.players && eventData.players.length > 0) {
                        document.getElementById('player1name').textContent = eventData.players[0].toString();
                        document.getElementById('player2name').textContent = eventData.players[1].toString();
                    }
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

		if (isAnimating) { return; }
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
				isAnimating = false;
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
		
		if (is_animating) { return; }
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
				is_animating = false;
			}
		}

		requestAnimationFrame(updateTween);
	}

	function playWallSound() {
		let beat = new Audio('../src/assets/osu-hit-sound.mp3');
		document.addEventListener("click", function () {
			beat.play();
		}, { once: true });
	}


	const local_player = sessionStorage.getItem('username');
	var local_player_score = 0;
	var remote_player_score = 0;

	var socket;
	let id = "1"

	console.log('here');
	fetch("http://localhost:8000/api/matchmaking?clientID=" + local_player, {
		method: "GET"
	})
	.then(res => res.json())
	.then(data => {
		console.log('data is', data)
		socket = new WebSocket(`ws://localhost:8000/dong?roomID=${data.roomID}&clientID=${local_player}`);
		socket.onopen = function(event) {
			console.log("WebSocket connection opened");
			console.log("client", local_player, "joined room", data.roomID);
		};
		socket.onmessage = function(event) {
			let endElement = document.getElementById("dongball");
			if (data.players.length == 1 && !endElement) {
				window.location.reload();
				console.log('bummer');
			}

			if (isJSON(event.data)) {
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
							remote_player_score += 1;
							document.getElementById('player2score').textContent = remote_player_score.toString();
						}
						if (eventData.hit == "HIT RIGHT") {
							local_player_score += 1;
							document.getElementById('player1score').textContent = local_player_score.toString();
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
			fetch("http://localhost:8000/api/closeRoom?room_code=" + encodeURIComponent(data.roomID), {
				method: 'DELETE'
			})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to close room');
				}
				return response.json();
			})
			.then(data => {
				console.log(data.message);
				window.history.pushState({}, "", "/vs-player");
				router();
			})
			.catch(error => {
				console.error('Error closing room:', error);
			});
		};
		socket.onerror = function(event) {
			console.error("WebSocket error:", event);
			console.error("WebSocket connection closed due to room already have 2 players or room not found");
		};
		
		return data;
	})
	.then(data => {
		console.log('data is', data);

		if (data.players.length == 1) {
			replace_html(`
<div class="d-flex position-absolute align-items-center unselectable ml-4" style="height: 110px; z-index: 1">
	<p data-link="/vs-player" class="description scale-up cursor-pointer">CANCEL</p>
</div>
<div class="d-flex flex-column align-items-center justify-content-center h-100">
	<div class="important-label" style="font-size: 40px;">${data.roomID.toString()}</div>
	<div class="important-label" style="font-size: 50px;">Matchmaking...</div>
</div>`);
		} else {
			replace_html(`
<div class="vw-100 vh-100 p-5">
	<div class="d-flex justify-content-between w-80 mx-auto pb-3">
		<div class="d-flex flex-row player-text player-1-text-color justify-content-end align-items-end">
			<div id=player1score class="player-score-text-size pr-2">${local_player_score.toString()}</div>
			<div id=player1name class="player-username-text-size pb-2">${data.players[0]}</div>
		</div>
		<div class="d-flex flex-row player-text player-2-text-color justify-content-end align-items-end">
			<div id=player2name class="player-username-text-size pb-2">${data.players[1]}</div>
			<div id=player2score class="player-score-text-size pl-2">${remote_player_score.toString()}</div>
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
</div>`);
		}

		setTimeout(() => {
			socket.send(JSON.stringify({ "command": "START_GAME" }));
		}, 5000);
	})
	.catch(error => {
		console.error("Error: ", error);
	});


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
                </div>
            </div>
        </div>
    `;
}

export default game;