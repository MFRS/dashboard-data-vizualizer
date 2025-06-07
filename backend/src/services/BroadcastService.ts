import { WebSocketServer } from "ws";
import { fetchData } from "../fetcher";
import { EndpointData } from "../types";

export class BroadcastService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private latestData: EndpointData[] = [];

  constructor(
    private readonly wss: WebSocketServer,
    private readonly interval: number = 10000
  ) {}

  start() {
    if (this.intervalId) return; // already running
    this.intervalId = setInterval(async () => {
      try {
        const data = await fetchData();
        this.latestData = data;
        const message = JSON.stringify(data);

        this.wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(message);
          }
        });
      } catch (err) {
        console.error("Broadcast error:", err);
      }
    }, this.interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getLatestData(): EndpointData[] {
    return this.latestData;
  }
}
