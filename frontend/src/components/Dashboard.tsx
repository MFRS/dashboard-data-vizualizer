import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const Dashboard = () => {
  const { data, status } = useWebSocket("ws://localhost:3000");

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600">
          Connection Status: <span className="font-semibold">{status}</span>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">DevOps Region Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...(data || [])]
          .sort((a, b) => a.region.localeCompare(b.region))
          .map((region) => (
            <div
              key={region.region}
              className={`p-4 border rounded shadow ${
                region.status === "online" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <h3 className="text-lg font-semibold">{region.region}</h3>
              <p>Status: {region.status}</p>
              <p>Load: {region.load ?? "N/A"}</p>
              <p>CPU Load: {region.stats?.server?.cpu_load ?? "N/A"}</p>
              <p>
                Connections: {region.stats?.server?.active_connections ?? "N/A"}
              </p>
              <p>Sessions: {region.stats?.session ?? "N/A"}</p>
              <p>Servers Count: {region.stats?.servers_count ?? "N/A"}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
