"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastService = void 0;
// backend/src/services/BroadcastService.ts
const ws_1 = require("ws");
const fetcher_1 = require("../fetcher");
class BroadcastService {
    constructor(wss, interval = 2000) {
        this.wss = wss;
        this.interval = interval;
        this.intervalId = null;
        this.latestData = [];
    }
    start(customInterval) {
        if (this.intervalId) {
            console.warn(" Broadcast already started; skipping.");
            return;
        }
        const effectiveInterval = customInterval ?? this.interval;
        console.log(` Starting broadcast every ${effectiveInterval}ms`);
        this.intervalId = setInterval(async () => {
            try {
                const data = await (0, fetcher_1.fetchData)();
                this.latestData = data;
                const message = JSON.stringify(data);
                this.broadcast(message);
            }
            catch (err) {
                console.error("📡 Broadcast error:", err.message ?? err);
            }
        }, effectiveInterval);
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log(" Broadcast stopped.");
            this.intervalId = null;
        }
    }
    broadcast(message) {
        const clientCount = this.wss.clients.size;
        console.log(` Broadcasting to ${clientCount} client(s).`);
        this.wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
    getLatestData() {
        return this.latestData;
    }
}
exports.BroadcastService = BroadcastService;
