import { navigate } from "./main.js";

function game()
{

  let player_1_score = 3;
  let player_2_score = 0;
  let player_1_username = "sealw4ll";
  let player_2_username = "lwilliam";

  var socket;

  function tweenBallPosition(element, targetX, targetY, duration) {
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
        }
    }

    requestAnimationFrame(updateTween);
}


    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "start") {
            socket = new WebSocket("ws://localhost:8000/dong/" ); // add + id at end
            // Set up WebSocket event listeners
            socket.onopen = function(event) {
                console.log("WebSocket connection opened");
            };
    
            socket.onmessage = function(event) {
                console.log("Received message:", event.data);
                let endElement = document.getElementById("dongball");
                let eventData = JSON.parse(event.data);
                if (endElement !== null) {
                  tweenBallPosition(endElement, eventData.ball_x, eventData.ball_y, 10);
                    // endElement.style.left = eventData.ball_x + "%";
                    // endElement.style.top = eventData.ball_y + "%";
                    // console.log(eventData.ball_x, eventData.ball_y);
                    // endElement.style.color = "blue";

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

    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 87) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("RUN");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        if (event.keyCode === 83) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("CHANGE");
            } else {
                console.error("WebSocket connection not established or closed");
            }
        }
        // do something
      });

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
        Game goes here
        <h1>WebSocket Test</h1>
        <p>Open the console to see the WebSocket messages</p>
        <div id="dongball"></div>
        <button id="start">Start Websocket</button>
        <button id="ping">Ping</button>
        <button id="RUN">Increment</button>
        <button id="change">Decrement</button>
        <button id="end">End Websocket</button>
      </div>
      <div>
        
      </div>
    </div>
  `)
}

export default game;