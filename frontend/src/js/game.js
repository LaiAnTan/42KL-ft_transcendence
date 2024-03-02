import { navigate } from "./main.js";

function game()
{

  const urlParams = new URLSearchParams(window.location.search);
  let player_1_score = 3;
  let player_2_score = 0;
  let player_1_username = "sealw4ll";
  let player_2_username = "lwilliam";
  let is_animating = false;

  var socket;

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


    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "start") {
            socket = new WebSocket("ws://localhost:8000/dong?roomID=" + urlParams.get('roomID')); // add + id at end
            // Set up WebSocket event listeners
            socket.onopen = function(event) {
                console.log("WebSocket connection opened");
            };
    
            socket.onmessage = function(event) {
                // console.log("Received message:", event.data);
                let endElement = document.getElementById("dongball");
                if (event.data == "HIT LEFT")
                {
                    console.log("HIT LEFT");
                    return ;
                }
                if (event.data == "HIT RIGHT")
                {
                    console.log("HIT RIGHT");
                    return ;
                }
                let eventData = JSON.parse(event.data);
                if (endElement !== null) {
                    tweenBallPosition(endElement, eventData.ball_x, eventData.ball_y, 1);
                    tweenPaddlePosition(document.getElementById('paddle_left'), eventData.paddle_left_y, 5);
                    tweenPaddlePosition(document.getElementById('paddle_right'), eventData.paddle_right_y, 5);
                } else {
                    console.error("Element with id 'end' not found.");
                }
            };
    
            socket.onclose = function(event) {
                console.log("WebSocket connection closed");
            };
    
            socket.onerror = function(event) {
                console.error("WebSocket error:", event);
            };
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
        // Add the pressed key to the Set
        pressedKeys.add(event.key);
        
        // Handle the keys based on the Set
        handleKeys();
    });

    document.addEventListener("keyup", (event) => {
        // Remove the released key from the Set
        pressedKeys.delete(event.key);
        
        // Handle the keys based on the Set
        handleKeys();
    });
    
    function handleKeys() {
        if (pressedKeys.has('w')) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("PADDLE_LEFT_UP");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (pressedKeys.has('s')) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("PADDLE_LEFT_DOWN");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (pressedKeys.has('ArrowUp')) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("PADDLE_RIGHT_UP");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (pressedKeys.has('ArrowDown')) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("PADDLE_RIGHT_DOWN");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
    }

    return (`
        <div class="w-100 p-5 game-background">
            <div class="d-flex justify-content-between w-80 mx-auto pb-3">
                <div class="d-flex flex-row player-text player-1-text-color justify-content-end align-items-end">
                    <div class="player-score-text-size pr-2">${player_1_score.toString()}</div>
                    <div class="player-username-text-size pb-2">${player_1_username}</div>
                </div>
                <div class="d-flex flex-row player-text player-2-text-color justify-content-end align-items-end">
                    <div class="player-username-text-size pb-2">${player_2_username}</div>
                    <div class="player-score-text-size pl-2">${player_2_score.toString()}</div>
                </div>
            </div>
            <div class="position-relative d-flex align-items-center justify-content-center game-box w-80 mx-auto">
                <div id="dongball"></div>
                <div id="paddle_left"></div>
                <div id="paddle_right"></div>
                <button id="start">Start Websocket</button>
                <button id="end">End Websocket</button>
            </div>
            <div>
            </div>
        </div>
    `)
}

export default game;