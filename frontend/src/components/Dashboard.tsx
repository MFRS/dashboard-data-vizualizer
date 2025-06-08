import React, { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { EndpointData } from "@shared/types/EndpointData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
  BarChart,
  Bar,
} from "recharts";
import RegionModal from "./RegionModal";

interface HistoricalData extends EndpointData {
  cpuHistory?: number[];
}

const Dashboard: React.FC = () => {
  const { status, data } = useWebSocket("ws://localhost:3000");
  const [selected, setSelected] = useState<EndpointData | null>(null);

  useEffect(() => {
    if (data) {
      const stored = localStorage.getItem("selectedRegion");
      const found = data.find((r) => r.region === stored);
      if (found) setSelected(found);
    }
  }, [data]);

  useEffect(() => {
    if (selected) localStorage.setItem("selectedRegion", selected.region);
    else localStorage.removeItem("selectedRegion");
  }, [selected]);

  if (!data) return <p className="p-4">Waiting for data...</p>;

  const avgCpu =
    data.reduce((sum, r) => sum + r.stats.server.cpu_load, 0) / data.length;
  const totalConns = data.reduce(
    (sum, r) => sum + r.stats.server.active_connections,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">DevOps Dashboard</h2>
      <div className="text-gray-600 mb-4">
        WebSocket Status: <strong>{status}</strong>
      </div>

      {/* Global Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="font-medium mb-1">Average CPU Load</p>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            {(avgCpu * 100).toFixed(1)}%
          </p>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={[{ name: "Avg CPU", value: avgCpu * 100 }]}>
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <p className="font-medium mb-1">Total Active Connections</p>
          <p className="text-2xl font-bold text-orange-600 mb-2">
            {totalConns}
          </p>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={[{ name: "Conns", value: totalConns }]}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip formatter={(v: number) => `${v}`} />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...data]
          .sort((a, b) => a.region.localeCompare(b.region))
          .map((region) => {
            const histRegion = region as HistoricalData;
            const stats = region.stats.server;

            return (
              <div
                key={region.region}
                onClick={() => setSelected(region)}
                className={`bg-white p-4 rounded-lg shadow border-2 cursor-pointer hover:shadow-lg transition ${
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

                {histRegion.cpuHistory?.length > 1 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span>CPU Trend (%)</span>
                      <span className="text-right text-blue-600">
                        {(stats.cpu_load * 100).toFixed(1)}%
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={50}>
                      <LineChart
                        data={histRegion.cpuHistory.map((v, i) => ({
                          time: i,
                          cpu: v * 100,
                        }))}
                      >
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip
                          formatter={(v: number) => `${v.toFixed(1)}%`}
                        />
                        <ReferenceLine
                          y={80}
                          stroke="red"
                          strokeDasharray="3 3"
                        />
                        <ReferenceArea
                          y1={80}
                          y2={100}
                          fill="red"
                          fillOpacity={0.1}
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

                <div className="text-sm space-y-1 mb-2">
                  <p>Load: {region.load ?? "N/A"}</p>
                  <p>Connections: {stats.active_connections}</p>
                  <p>Sessions: {region.stats.session ?? "N/A"}</p>
                  <p>Servers: {stats.servers_count}</p>
                  <p>Wait: {stats.wait_time}ms</p>
                  <p>Timers: {stats.timers}</p>
                </div>
              </div>
            );
          })}
      </div>

      {selected && (
        <RegionModal region={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default Dashboard;
