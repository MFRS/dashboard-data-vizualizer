import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { EndpointData } from "../types/EndpointData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { data, status } = useWebSocket("ws://localhost:3000");

  if (!data) return <p className="p-4">Waiting for data...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">DevOps Dashboard</h2>
      <div className="text-gray-600 mb-4">
        WebSocket Status: <strong>{status}</strong>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...data]
          .sort((a, b) => a.region.localeCompare(b.region))
          .map((region: EndpointData) => {
            const stats = region.stats.server;
            return (
              <div
                key={region.region}
                className={`bg-white p-4 rounded-lg shadow ${
                  region.status === "online"
                    ? "border-green-300"
                    : "border-red-300"
                } border-2`}
              >
                <h3 className="text-lg font-semibold flex justify-between">
                  {region.region}
                  <span
                    className={`px-2 py-0.5 text-sm rounded ${
                      region.status === "online" ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    {region.status}
                  </span>
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Version: {region.version}
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm">CPU Load</p>
                    <ResponsiveContainer width="100%" height={50}>
                      <BarChart
                        data={[{ name: "CPU", load: stats.cpu_load * 100 }]}
                      >
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                        />
                        <Bar dataKey="load" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <p className="text-sm">Active Connections</p>
                    <ResponsiveContainer width="100%" height={50}>
                      <BarChart
                        data={[
                          { name: "Conns", value: stats.active_connections },
                        ]}
                      >
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip formatter={(value: number) => `${value}`} />
                        <Bar dataKey="value" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>Servers: {region.stats.servers_count}</p>
                    <p>Sessions: {region.stats.session}</p>
                    <p>Wait Time: {stats.wait_time}ms</p>
                    <p>Timers: {stats.timers}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard;
