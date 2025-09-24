import React from "react";
import type { EndpointData } from "@shared/EndpointData";
import ServiceHealth from "./ServiceHealth";
import ServerStats from "./ServerStats";
import WorkerPools from "./WorkerPools";

const RegionCard: React.FC<{ data: EndpointData & { roles?: string[] } }> = ({
  data,
}) => {
  const online = data.status === "online";
  return (
    <div
      className={`p-4 border rounded-lg space-y-2 cursor-pointer hover:shadow-lg transition ${
        online ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">{data.region}</h3>
        <span
          className={`px-2 py-0.5 rounded text-sm ${
            online ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {data.status}
        </span>
      </div>
      <p className="text-xs text-gray-500">
        v{data.version} · Roles: {data.roles?.join(", ") ?? "-"}
      </p>
      <ServiceHealth services={data.services} />
      <ServerStats stats={data.stats} />
      <WorkerPools workers={data.stats.server.workers} />
    </div>
  );
};

export default RegionCard;
