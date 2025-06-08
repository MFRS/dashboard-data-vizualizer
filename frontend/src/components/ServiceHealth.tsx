import React from "react";
import type { EndpointData } from "../types/EndpointData";

const ServiceHealth: React.FC<{ services: EndpointData["services"] }> = ({
  services,
}) => (
  <div className="flex space-x-3">
    {Object.entries(services).map(([name, good]) => (
      <div
        key={name}
        className={`px-2 py-1 rounded text-sm ${
          good ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {name}: {good ? "✅" : "❌"}
      </div>
    ))}
  </div>
);

export default ServiceHealth;
