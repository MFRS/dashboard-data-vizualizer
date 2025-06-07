import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const Dashboard = () => {
  const { data, status } = useWebSocket("ws://localhost:3000"); // update if deployed

  return (
    <div className="p-6">
      <div>
        <p>Status: {status}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <h2 className="text-xl font-bold mb-4">DevOps Status Dashboard</h2>
      <p>Status: {status}</p>
      <ul className="mt-4 space-y-2">
        {data?.map((EndpointData) => (
          <li
            key={EndpointData.region}
            className={`p-4 border rounded ${
              EndpointData.status === "online" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <strong>{EndpointData.region}</strong>: {EndpointData.status} | Load:{" "}
            {EndpointData.load ?? "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
