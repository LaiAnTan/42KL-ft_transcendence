export default () => {
    var socket;

    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "start") {
            socket = new WebSocket("ws://localhost:8000/dong/" ); // add + id at end
            // Set up WebSocket event listeners
            socket.onopen = function(event) {
                console.log("WebSocket connection opened");
            };
    
            socket.onmessage = function(event) {
                console.log("Received message:", event.data);
                let endElement = document.getElementById("end");
                let eventData = JSON.parse(event.data);
                if (endElement !== null) {
                    endElement.style.left = eventData.ball_x + "px";
                    endElement.style.top = eventData.ball_y + "px";
                    console.log(eventData.ball_x, eventData.ball_y);
                    endElement.style.color = "blue";

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

    // document.addEventListener("DOMContentLoaded", (event) => {
    //     console.log("DOM fully loaded and parsed");
    //     let endElement = document.getElementById("end");
    //     if (endElement !== null) {
    //     // Access the style property and set the color to red
    //         console.log("endElement", endElement);
    //         endElement.style.color = "blue";
    //     } else {
    //         console.error("Element with id 'end' not found.");
    //     }
    // });

    return `
        <h1>WebSocket Test</h1>
        <p>Open the console to see the WebSocket messages</p>
        <button id="start">Start Websocket</button>
        <button id="ping">Ping</button>
        <button id="RUN">Increment</button>
        <button id="change">Decrement</button>
        <button id="end">End Websocket</button>
    `;
};
