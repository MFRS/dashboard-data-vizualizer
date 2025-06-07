import { renderHook } from "@testing-library/react";
import WS from "jest-websocket-mock";
import waitFor from "wait-for-expect";
import { useWebSocket } from "../hooks/useWebSocket";

let server: WS;
let delayBroadcast = 10000;

beforeEach(() => {
  server = new WS("ws://localhost:1234");
});

afterEach(() => {
  WS.clean(); // Cleans up all servers
});

test("receives and parses messages from WebSocket", async () => {
  const { result } = renderHook(() => useWebSocket("ws://localhost:1234"));

  await server.connected; // Ensure the client is connected before sending

  const mockMessage = [{ region: "us-east", status: "online", load: 0.5 }];
  server.send(JSON.stringify(mockMessage));

  await waitFor(() => {
    expect(result.current).toEqual({
      status: "connected",
      data: mockMessage,
    });
  });

}, delayBroadcast);
