import React, { useEffect, useState, useRef } from "react";
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
import { toast } from "react-toastify";

interface HistoricalData extends EndpointData {
  cpuHistory?: number[];
}

const CPU_ALERT_THRESHOLD = 0.85;
const CONN_ALERT_THRESHOLD = 10000;

const Dashboard: React.FC = () => {
  const { status, data } = useWebSocket("ws://localhost:3000");
  const [selected, setSelected] = useState<EndpointData | null>(null);
  const [history, setHistory] = useState<EndpointData[][]>([]);
  const alerted = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (data) {
      const stored = localStorage.getItem("selectedRegion");
      const found = data.find((r) => r.region === stored);
      if (found) setSelected(found);
    }
  }, [data]);

  useEffect(() => {
    if (selected) {
      localStorage.setItem("selectedRegion", selected.region);
    } else {
      localStorage.removeItem("selectedRegion");
    }
  }, [selected]);

  useEffect(() => {
    if (data) {
      setHistory((prev) => [...prev.slice(-299), data]);
    }
  }, [data]);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-history-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🎯 New CSV download function
  const downloadCSV = () => {
    if (!history.length) return;

    const rows: string[] = [];
    const header = [
      "timestamp",
      "region",
      "status",
      "cpu_load",
      "active_connections",
      "servers_count",
      "sessions",
      "wait_time",
      "timers",
    ].join(",");
    rows.push(header);

    history.forEach((snapshot, idx) => {
      const ts = new Date(
        Date.now() - (history.length - idx) * 1000
      ).toISOString();
      snapshot.forEach((r) => {
        const stats = r.stats.server;
        const fields = [
          ts,
          r.region,
          r.status,
          stats.cpu_load.toString(),
          stats.active_connections.toString(),
          r.stats.servers_count.toString(),
          r.stats.session.toString(),
          stats.wait_time.toString(),
          stats.timers.toString(),
        ];
        rows.push(fields.join(","));
      });
    });

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-history-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (data) {
      data.forEach((r) => {
        const cpu = r.stats.server.cpu_load;
        const conns = r.stats.server.active_connections;

        if (
          cpu > CPU_ALERT_THRESHOLD &&
          !alerted.current.has(`${r.region}-cpu`)
        ) {
          toast.warning(`${r.region} CPU high: ${(cpu * 100).toFixed(1)}%`, {
            toastId: `${r.region}-cpu`,
          });
          alerted.current.add(`${r.region}-cpu`);
        }

        if (
          conns > CONN_ALERT_THRESHOLD &&
          !alerted.current.has(`${r.region}-conn`)
        ) {
          toast.error(`${r.region} Connections high: ${conns}`, {
            toastId: `${r.region}-conn`,
          });
          alerted.current.add(`${r.region}-conn`);
        }
      });
    }
  }, [data]);

  if (!data) return <p className="p-4">Waiting for data...</p>;

  const avgCpu =
    data.reduce((sum, r) => sum + r.stats.server.cpu_load, 0) / data.length;
  const totalConns = data.reduce(
    (sum, r) => sum + r.stats.server.active_connections,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        {/* DevOps Dashboard */}
        <div className="flex space-x-2">
          <button
            onClick={downloadJSON}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ⬇ JSON
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            ⬇ CSV
          </button>
        </div>
      </h2>

      <div className="text-gray-600 mb-4">
        WebSocket Status: <strong>{status}</strong>
      </div>

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
                      <span>{(stats.cpu_load * 100).toFixed(1)}%</span>
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
