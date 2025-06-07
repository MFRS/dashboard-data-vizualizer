import { useEffect, useState } from "react";
import type { EndpointData } from "@shared/types/EndpointData";


export const useWebSocket = (url: string) => {
  const [data, setData] = useState<EndpointData[]>([]);
  const [status, setStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => setStatus("connected");
    socket.onclose = () => setStatus("disconnected");

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    return () => socket.close();
  }, [url]);

  return { data, status };
};
