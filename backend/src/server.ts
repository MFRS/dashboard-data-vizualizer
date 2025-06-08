// backend/src/server.ts
import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { BroadcastService } from "./services/BroadcastService";
import "module-alias/register";



const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.get("/health", (_: Request, res: Response) => {
  res.send("Server is up");
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });
const broadcaster = new BroadcastService(wss);

// Send latest state to new clients and log events
wss.on("connection", (ws) => {
  console.log("🔌 Client connected");
  ws.send(JSON.stringify(broadcaster.getLatestData()));

  ws.on("close", () => console.log("🔌 Client disconnected"));
  ws.on("error", (error) => console.error("🛑 WebSocket error:", error));
});

// Kick off a single broadcast loop when the server starts
if (process.env.NODE_ENV !== "test") {
  broadcaster.start();
}

export { app, server, broadcaster };
