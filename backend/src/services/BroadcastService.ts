// backend/src/services/BroadcastService.ts
import { WebSocketServer, WebSocket } from "ws";
import { fetchData } from "../fetcher";
import { EndpointData } from "../shared/types/EndpointData";

export class BroadcastService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private latestData: EndpointData[] = [];

  constructor(
    private readonly wss: WebSocketServer,
    private readonly interval: number = 2000
  ) {}

  public start(customInterval?: number) {
    if (this.intervalId) {
      console.warn(" Broadcast already started; skipping.");
      return;
    }
    const effectiveInterval = customInterval ?? this.interval;

    console.log(` Starting broadcast every ${effectiveInterval}ms`);
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
      console.log(" Broadcast stopped.");
      this.intervalId = null;
    }
  }

  private broadcast(message: string) {
    const clientCount = this.wss.clients.size;
    console.log(` Broadcasting to ${clientCount} client(s).`);
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
