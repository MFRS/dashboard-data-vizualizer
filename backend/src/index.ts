import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

const app = express();

//  Simple route to verify HTTP server is up
app.get("/health", (_, res) => {
  res.send("Server is up");
});

//  Wrap express in raw http server
const server = createServer(app);

//  Attach WebSocket server to the same HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔌 Client connected via WebSocket");

  // ✅ Send welcome message
  ws.send(JSON.stringify({ type: "welcome", message: "Connected to server" }));

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
