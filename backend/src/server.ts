// src/server.ts
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = express();

//  Single route for health check
app.get("/health", (_, res) => {
  res.send("Server is up");
});

//  Create HTTP server
const server = createServer(app);

//  Attach WebSocket (you can expand this later)
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ message: "Connected to server" }));
});

export { app, server };
