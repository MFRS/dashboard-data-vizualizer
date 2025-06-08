"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BroadcastService_1 = require("../services/BroadcastService");
const ws_1 = require("ws");
let delayBroadcast = 1000;
describe("BroadcastService", () => {
    let wss;
    let broadcaster;
    beforeEach(() => {
        wss = new ws_1.WebSocketServer({ port: 0 });
        broadcaster = new BroadcastService_1.BroadcastService(wss);
    });
    afterEach(() => {
        broadcaster.stop();
        wss.close();
    });
    it("should start and stop broadcasting", () => {
        jest.useFakeTimers();
        broadcaster.start(delayBroadcast);
        jest.advanceTimersByTime(1000); // simulate passage of time
        expect(broadcaster["intervalId"]).not.toBeNull();
        broadcaster.stop();
        expect(broadcaster["intervalId"]).toBeNull();
    });
});
