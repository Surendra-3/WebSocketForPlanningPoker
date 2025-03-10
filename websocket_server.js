const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let votes = [];

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Server received:", message); // Debug log
    const data = JSON.parse(message);
    if (data.type === "vote") {
      // console.log(`vote: ${data.name}`); // Debug user join
      // votes.push(data.value);
      // broadcast(JSON.stringify({ type: "vote", value: data.value }));
      console.log(`Vote received from ${data.name}: ${data.value}`);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "vote", name: data.name, value: data.value }));
        }
      });
    }
    if (data.type === "user-joined") {
      console.log(`User joined: ${data.name}`); // Debug user join
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "user-joined", name: data.name }));
        }
      });
    }
    if(data.type === "reveal-votes"){
      console.log("Reveal votes");
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "reveal-votes" }));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
    console.log("braodcast message", message);
  });
}

console.log("WebSocket server running on ws://localhost:8080");

