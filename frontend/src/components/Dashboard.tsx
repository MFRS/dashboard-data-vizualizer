import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const Dashboard = () => {
  const { data, status } = useWebSocket("ws://localhost:3000");

  return (
    <div className="p-6">
      {/* <div>
        <p>Status: {status}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}

      <h2 className="text-xl font-bold mb-4">DevOps Status Dashboard</h2>

      {data ? (
        <ul className="mt-4 space-y-2">
          {data.map((endpointData) => (
            <li
              key={endpointData.region}
              className={`p-4 border rounded ${
                endpointData.status === "online" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <strong>{endpointData.region}</strong>: {endpointData.status} |
              Load: {endpointData.load ?? "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Waiting for data...</p>
      )}
    </div>
  );
};

export default Dashboard;
