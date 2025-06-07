import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { fetchData } from "./fetcher";
import { EndpointData } from "@shared/types/EndpointData";

import { BroadcastService } from "./services/BroadcastService";

const app = express();
app.get("/health", (_: Request, res: Response) => {
  res.send("Server is up");
});

const server = createServer(app);

server.listen(3000, () => {
  console.log("🚀 Server is listening on port 3000");
});

// Attach WebSocket to the same HTTP server
const wss = new WebSocketServer({ server });

// Create a broadcaster
const broadcaster = new BroadcastService(wss);

// Log incoming WebSocket connections
wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (message) => {
    console.log(` Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log(" Client disconnected");
  });

  ws.on("error", (error) => {
    console.error(` WebSocket error:`, error);
  });
});

// Start broadcasting if not in test mode
if (process.env.NODE_ENV !== "test") {
  broadcaster.start();
}

// Export for tests
export { app, server, broadcaster };
