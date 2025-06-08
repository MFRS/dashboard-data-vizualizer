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

  const CPU_ALERT_THRESHOLD = 0.8;
  const WAIT_ALERT_THRESHOLD = 500;

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
            const cpuAlert = stats.cpu_load >= CPU_ALERT_THRESHOLD;
            const waitAlert = stats.wait_time >= WAIT_ALERT_THRESHOLD;
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

                {/* Alert / Healthy badges */}
                <div className="flex gap-2 mb-3">
                  {cpuAlert ? (
                    <span className="bg-red-200 text-red-800 px-2 rounded text-xs">
                      High CPU
                    </span>
                  ) : (
                    <span className="bg-green-200 text-green-800 px-2 rounded text-xs">
                      CPU OK
                    </span>
                  )}

                  {waitAlert ? (
                    <span className="bg-red-200 text-red-800 px-2 rounded text-xs">
                      High Wait
                    </span>
                  ) : (
                    <span className="bg-green-200 text-green-800 px-2 rounded text-xs">
                      Wait OK
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">CPU Load</p>
                    <ResponsiveContainer width="100%" height={50}>
                      <BarChart
                        data={[{ name: "CPU", load: stats.cpu_load * 100 }]}
                      >
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                        />
                        <Bar
                          dataKey="load"
                          fill={cpuAlert ? "#dc2626" : "#10b981"} // red if high, green if ok
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Active Connections</p>
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
