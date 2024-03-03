import { navigate, loadCSS } from "./main.js";

function game() {
	loadCSS("src/css/game.css");

	let player_1_score = 0;
	let player_2_score = 0;
	let player_1_username = "sealw4ll";
	let player_2_username = "lwilliam";
  let is_animating = false;
  var socket;
//   let id = toString(Math.floor(Math.random() * (1 - 1000000 + 1) + 1));
  let id = "1"

  let isLeftPaddleAnimating = false;
  let isRightPaddleAnimating = false;
  
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

    // AUDIO HOW

    // Create an Audio element
    // const audio = new Audio();

    // // Set the source of the audio file
    // audio.src = 'https://www.myinstants.com/en/instant/osu-hit-sound-29289/?utm_source=copy&utm_medium=share';

    // // Load the audio (asynchronously)
    // audio.load();

    // // Play the audio when loading is complete
    // audio.addEventListener('loadeddata', function() {
    //     audio.play();
    // });

    // // Handle errors
    // audio.addEventListener('error', function(e) {
    //     console.error('Error loading or playing the MP3 audio:', e);
    // });
}

function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}


    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "start") {
            socket = new WebSocket("ws://localhost:8000/dong/" ); // add + id at end
            // Set up WebSocket event listeners
            socket.onopen = function(event) {
                // socket.send(JSON.stringify({
                //     id: id,
                // }));
                // socket.send(JSON.stringify({
                //     id: "HAHAHAHAHHA",
                // }));
                console.log("WebSocket connection opened");
            };
    
            socket.onmessage = function(event) {
                // console.log("Received message:", event.data);
                if (isJSON(event.data))
                {
                    let endElement = document.getElementById("dongball");
                    let eventData = JSON.parse(event.data);
                    if (endElement !== null) {
                        tweenBallPosition(endElement, eventData.ball_x, eventData.ball_y, 1);
                        tweenPaddlePosition(document.getElementById('paddle_left'), eventData.paddle_left_y, 2);
                        tweenPaddlePosition(document.getElementById('paddle_right'), eventData.paddle_right_y, 2);
                        return ;
                    } else {
                        console.error("Element with id 'end' not found.");
                    }
                }
                else
                {
                    if (event.data == "HIT WALL")
                    {
                        console.log("SOUNDDDD");
                        playWallSound();
                        return ;
                    }
                    if (event.data == "HIT LEFT")
                    {
                        player_2_score += 1;
                        document.getElementById('player2score').textContent = player_2_score.toString();
                        console.log("HIT LEFT");
                        return ;
                    }
                    if (event.data == "HIT RIGHT")
                    {
                        player_1_score += 1;
                        document.getElementById('player1score').textContent = player_1_score.toString();
                        console.log("HIT RIGHT");
                        return ;
                    }
                }
            };
    
            socket.onclose = function(event) {
                console.log("WebSocket connection closed");
            };
    
            socket.onerror = function(event) {
                console.error("WebSocket error:", event);
            };
        }
        if (event.target && event.target.id === "ping") {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("PING");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (event.target && event.target.id === "change") {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("CHANGE");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (event.target && event.target.id === "RUN") {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("RUN");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (event.target && event.target.id === "end") {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
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
    
    // document.addEventListener("keydown", (event) => {
    //     // Add the pressed key to the Set
    //     pressedKeys.add(event.key);
        
    //     // Handle the keys based on the Set
    //     handleKeys();
    // });

    // document.addEventListener("keyup", (event) => {
    //     // Remove the released key from the Set
    //     pressedKeys.delete(event.key);
        
    //     // Handle the keys based on the Set
    //     handleKeys();
    // });
    
    // function handleKeys() {
    //     // Check if 'w' is in the pressed keys
    //     if (pressedKeys.has('w')) {
    //         if (socket && socket.readyState === WebSocket.OPEN) {
    //         // socket.send("PADDLE_LEFT_UP");
    //         socket.send(JSON.stringify({
    //             direction: "PADDLE_UP",
    //             id: id,
    //         }));
    //     } else {
    //         console.error("WebSocket connection not established or closed");
    //     }
    // }
    
    // // Check if 's' is in the pressed keys
    // if (pressedKeys.has('s')) {
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         // socket.send("PADDLE_LEFT_DOWN");
    //         socket.send(JSON.stringify({
    //             direction: "PADDLE_DOWN",
    //             id: id,
    //         }));
    //     } else {
    //         console.error("WebSocket connection not established or closed");
    //     }
    // }

    // Check if 'ArrowUp' is in the pressed keys
    // if (pressedKeys.has('ArrowUp')) {
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         socket.send("PADDLE_RIGHT_UP");
    //     } else {
    //         console.error("WebSocket connection not established or closed");
    //     }
    // }
    
    // // Check if 'ArrowDown' is in the pressed keys
    // if (pressedKeys.has('ArrowDown')) {
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         socket.send("PADDLE_RIGHT_DOWN");
    //     } else {
    //         console.error("WebSocket connection not established or closed");
    //     }
    // }
    
    // Continue handling other keys as needed
// }

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
		<div class="game-box mx-auto">
			Game goes here
			<h1>WebSocket Test</h1>
			<p>Open the console to see the WebSocket messages</p>
			<div id="dongball"></div>
			<div id="paddle_left"></div>
			<div id="paddle_right"></div>
			<button id="start">Start Websocket</button>
			<button id="ping">Ping</button>
			<button id="RUN">Increment</button>
			<button id="change">Decrement</button>
			<button id="end">End Websocket</button>
		</div>
	</div>
</div>
	`;
}

export default game;

    // document.addEventListener("keydown", (event) => {
    //     if (event.key === 'w') {
    //         if (socket && socket.readyState === WebSocket.OPEN) {
    //             socket.send("PADDLE_LEFT_UP");
    //         } else {
    //             console.error("WebSocket connection not established or closed");
    //         }
    //     }
    //     if (event.key === 's') {
    //         if (socket && socket.readyState === WebSocket.OPEN) {
    //             socket.send("PADDLE_LEFT_DOWN");
    //         } else {
    //             console.error("WebSocket connection not established or closed");
    //         }
    //     }
    
    //     if (event.key === 'ArrowUp') {
    //         if (socket && socket.readyState === WebSocket.OPEN) {
    //             socket.send("PADDLE_RIGHT_UP");
    //         } else {
    //             console.error("WebSocket connection not established or closed");
    //         }
    //     }
    //     if (event.key === 'ArrowDown') {
    //         if (socket && socket.readyState === WebSocket.OPEN) {
    //             socket.send("PADDLE_RIGHT_DOWN");
    //         } else {
    //             console.error("WebSocket connection not established or closed");
    //         }
    //     }
    //     // do something
    //   });