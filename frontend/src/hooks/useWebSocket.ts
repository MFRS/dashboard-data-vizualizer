// frontend/src/hooks/useWebSocket.ts

import { useEffect, useRef, useState } from "react";
import type { EndpointData } from "@shared/types/EndpointData";

interface HistoricalData extends EndpointData {
  cpuHistory?: number[];
}

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );
  const [data, setData] = useState<HistoricalData[] | null>(null);
  const historyRef = useRef<Record<string, number[]>>({});

  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => setStatus("connected");

      socket.onmessage = (event) => {
        try {
          const incoming = JSON.parse(event.data) as EndpointData[];

          const enriched = incoming.map((region) => {
            const prev = historyRef.current[region.region] ?? [];
            const updated = [...prev.slice(-29), region.stats.server.cpu_load];

            historyRef.current[region.region] = updated;

            return {
              ...region,
              cpuHistory: updated,
            };
          });

          setData(enriched);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      socket.onclose = () => {
        setStatus("disconnected");
        reconnectTimeout = setTimeout(connect, 5000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        socket.close();
      };
    };

    connect();

    const handleBeforeUnload = () => {
      socket.close();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(reconnectTimeout);
      socket.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [url]);

  return { status, data };
}
