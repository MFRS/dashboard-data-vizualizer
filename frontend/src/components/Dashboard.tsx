import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { EndpointData } from "@shared/types/EndpointData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HistoricalData extends EndpointData {
  cpuHistory?: number[];
}

const Dashboard: React.FC = () => {
  const { status, data } = useWebSocket("ws://localhost:3000");

  if (!data) {
    return <p className="p-4">Waiting for data...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">DevOps Dashboard</h2>
      <div className="text-gray-600 mb-4">
        WebSocket Status: <strong>{status}</strong>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...data]
          .sort((a, b) => a.region.localeCompare(b.region))
          .map((region) => {
            const histRegion = region as HistoricalData;
            const stats = region.stats.server;

            return (
              <div
                key={region.region}
                className={`bg-white p-4 rounded-lg shadow border-2 ${
                  region.status === "online"
                    ? "border-green-300"
                    : "border-red-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{region.region}</h3>
                  <span
                    className={`px-2 py-0.5 text-sm rounded ${
                      region.status === "online" ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    {region.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Version: {region.version}
                </p>

                {/* CPU sparkline */}
                {histRegion.cpuHistory && histRegion.cpuHistory.length > 1 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium">CPU Trend (%)</p>
                    <ResponsiveContainer width="100%" height={50}>
                      <LineChart
                        data={histRegion.cpuHistory.map((val, idx) => ({
                          time: idx,
                          cpu: val * 100,
                        }))}
                      >
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip
                          formatter={(v: number) => `${v.toFixed(1)}%`}
                        />
                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Stats and other info */}
                <div className="text-sm space-y-1 mb-2">
                  <p>Current CPU: {(stats.cpu_load * 100).toFixed(1)}%</p>
                  <p>Load: {region.load ?? "N/A"}</p>
                  <p>Connections: {stats.active_connections}</p>
                  <p>Sessions: {region.stats.session ?? "N/A"}</p>
                  <p>Servers: {region.stats.servers_count}</p>
                  <p>Wait: {stats.wait_time}ms</p>
                  <p>Timers: {stats.timers}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard;
