import React from "react";
import type { EndpointData } from "../types/EndpointData";

const ServerStats: React.FC<{ stats: EndpointData["stats"] }> = ({ stats }) => {
  const s = stats.server;
  return (
    <div className="mt-2 text-sm grid grid-cols-2 gap-4">
      <p>Servers: {stats.servers_count}</p>
      <p>Users: {stats.online}</p>
      <p>Sessions: {stats.session}</p>
      <p>Active Conns: {s.active_connections}</p>
      <p>CPU Load: {(s.cpu_load * 100).toFixed(1)}%</p>
      <p>Wait: {s.wait_time}ms</p>
      <p>Timers: {s.timers}</p>
    </div>
  );
};

export default ServerStats;
