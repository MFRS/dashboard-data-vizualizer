import { HistoricalData } from "@/types/type";
import { EndpointData } from "@shared/EndpointData";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );
  const [data, setData] = useState<HistoricalData[] | null>(null);
  const historyRef = useRef<Record<string, number[]>>({});

  useEffect(() => {
    let socket: WebSocket;
    let reconnect: number;

    const connect = () => {
      socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => setStatus("connected");
      socket.onmessage = (e) => {
        try {
          const incoming = JSON.parse(e.data) as EndpointData[];
          const enriched = incoming.map((region) => {
            const prev = historyRef.current[region.region] ?? [];
            const patch = [...prev.slice(-29), region.stats.server.cpu_load];
            historyRef.current[region.region] = patch;
            return { ...region, cpuHistory: patch };
          });
          setData(enriched);
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
      };

      socket.onclose = () => {
        setStatus("disconnected");
        reconnect = window.setTimeout(connect, 5000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        socket.close();
      };
    };

    connect();

    return () => {
      window.clearTimeout(reconnect);
      socket.close();
    };
  }, [url]);

  return { status, data };
}
