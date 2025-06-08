import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const Dashboard = () => {
  const { data, status } = useWebSocket("ws://localhost:3000");

  if (!data) {
    return <p className="p-4">Waiting for data...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">DevOps Status Dashboard</h1>
      <p className="text-gray-600">
        Connection status: <strong>{status}</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((region) => {
          const stats = region.stats?.results?.stats || {};
          const services = region.stats?.results?.services || {};
          const workers = stats.server?.workers || [];
          const ioWorker = workers.find(([type]) => type === "io")?.[1] || {};

          return (
            <div
              key={region.region}
              className="border p-4 rounded shadow-md bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{region.region}</h2>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    region.status === "online"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {region.status}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Version:</strong> {region.stats?.version}
                </p>
                <p>
                  <strong>Services:</strong> Redis:{" "}
                  {services.redis ? "✅" : "❌"}, DB:{" "}
                  {services.database ? "✅" : "❌"}
                </p>
                <p>
                  <strong>CPU Load:</strong> {stats.server?.cpu_load ?? "N/A"}
                </p>
                <p>
                  <strong>Active Connections:</strong>{" "}
                  {stats.server?.active_connections ?? "N/A"}
                </p>
                <p>
                  <strong>IO Wait Time:</strong> {ioWorker.wait_time ?? "N/A"}{" "}
                  ms
                </p>
                <p>
                  <strong>IO Workers:</strong> {ioWorker.workers ?? "N/A"}
                </p>
              </div>

              {Array.isArray(ioWorker.top_keys) &&
                ioWorker.top_keys.length > 0 && (
                  <div>
                    <p className="font-semibold">Top Keys</p>
                    <ul className="list-disc list-inside text-sm">
                      {ioWorker.top_keys.map(([key, usage]) => (
                        <li key={key}>
                          {key}: {(usage * 100).toFixed(2)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
