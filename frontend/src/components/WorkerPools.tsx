import React, { useState } from "react";
import type { EndpointData } from "../types/EndpointData";

const WorkerPools: React.FC<{
  workers: EndpointData["stats"]["server"]["workers"];
}> = ({ workers }) => {
  const [search, setSearch] = useState("");

  const filteredWorkers = workers.filter(([name, w]) => {
    const matchesName = name.toLowerCase().includes(search.toLowerCase());
    const matchesKey = w.recently_blocked_keys.some(([key]) =>
      key.toLowerCase().includes(search.toLowerCase())
    );
    return matchesName || matchesKey;
  });

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search worker or blocked key..."
        className="w-full mb-4 p-2 text-sm border border-gray-300 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredWorkers.map(([name, w]) => (
        <div key={name} className="mb-3 bg-white rounded shadow-sm p-2">
          <p className="font-medium">{name}</p>
          <div className="text-xs grid grid-cols-2 gap-2">
            <p>Workers: {w.workers}</p>
            <p>Waiting: {w.waiting}</p>
            <p>Idle: {w.idle}</p>
            <p>Wait Time: {w.wait_time}ms</p>
            <p>Return Time: {w.time_to_return}ms</p>
            {w.recently_blocked_keys.length > 0 && (
              <details className="col-span-2">
                <summary>
                  Blocked Keys ({w.recently_blocked_keys.length})
                </summary>
                <ul className="pl-4 text-[10px]">
                  {w.recently_blocked_keys
                    .filter(([k]) =>
                      k.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(([k, c, ts], idx) => (
                      <li key={idx}>
                        {k}: {c} @ {new Date(ts).toLocaleTimeString()}
                      </li>
                    ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      ))}

      {filteredWorkers.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-4">
          No matches found.
        </p>
      )}
    </div>
  );
};

export default WorkerPools;
