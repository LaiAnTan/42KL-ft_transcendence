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
