"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcaster = exports.server = exports.app = void 0;
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const BroadcastService_1 = require("./services/BroadcastService");
require("module-alias/register");
const PORT = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
exports.app = app;
app.get("/health", (_, res) => {
    res.send("Server is up");
});
const server = (0, http_1.createServer)(app);
exports.server = server;
server.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
const wss = new ws_1.WebSocketServer({ server });
const broadcaster = new BroadcastService_1.BroadcastService(wss);
exports.broadcaster = broadcaster;
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
