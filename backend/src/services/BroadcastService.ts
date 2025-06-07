import { WebSocketServer, WebSocket } from "ws";
import { fetchData } from "../fetcher";
import { EndpointData } from "../types";

export class BroadcastService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private latestData: EndpointData[] = [];

  constructor(
    private readonly wss: WebSocketServer,
    private readonly interval: number = 10000
  ) {}

  public start(customInterval?: number) {
    if (this.intervalId) return;

    const effectiveInterval = customInterval ?? this.interval;

    this.intervalId = setInterval(async () => {
      try {
        const data = await fetchData();
        this.latestData = data;
        const message = JSON.stringify(data);
        this.broadcast(message);
      } catch (err) {
        console.error("📡 Broadcast error:", (err as Error).message ?? err);
      }
    }, effectiveInterval);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private broadcast(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public getLatestData(): EndpointData[] {
    return this.latestData;
  }
}
