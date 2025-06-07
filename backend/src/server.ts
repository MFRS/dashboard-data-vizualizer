
import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { fetchData } from "./fetcher";
import { EndpointData } from "./types";
import { BroadcastService } from "./services/BroadcastService";

const app = express();
app.get("/health", (_: Request, res: Response) => {
  res.send("Server is up");
});

const server = createServer(app);

//  Attach WebSocket to the same HTTP server
const wss = new WebSocketServer({ server });

//  Create a broadcaster and control it externally
const broadcaster = new BroadcastService(wss);

//  Optional: auto-start broadcasting (comment out in test env)
if (process.env.NODE_ENV !== "test") {
  broadcaster.start();
}

//  Export for use in index.ts and tests
export { app, server, broadcaster };
