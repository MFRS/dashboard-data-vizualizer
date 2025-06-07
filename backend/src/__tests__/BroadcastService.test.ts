
import { BroadcastService } from "../services/BroadcastService";
import { WebSocketServer } from "ws";

let delayBroadcast = 1000; 

describe("BroadcastService", () => {
  let wss: WebSocketServer;
  let broadcaster: BroadcastService;

  beforeEach(() => {
    wss = new WebSocketServer({ port: 0 });
    broadcaster = new BroadcastService(wss);
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
