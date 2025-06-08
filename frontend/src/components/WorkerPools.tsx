import React, { useState } from "react";
import type { EndpointData } from "../types/EndpointData";

type Worker = EndpointData["stats"]["server"]["workers"][0][1];

type BlockedKey = [string, number, string]; // [key, count, timestamp]

const WorkerPools: React.FC<{
  workers: EndpointData["stats"]["server"]["workers"];
}> = ({ workers }) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: "count" | "time";
    direction: "asc" | "desc";
  } | null>(null);

  const filteredWorkers = workers.filter(([name, w]) => {
    const nameMatch = name.toLowerCase().includes(search.toLowerCase());
    const blockedMatch = w.recently_blocked_keys.some(([k]) =>
      k.toLowerCase().includes(search.toLowerCase())
    );
    return nameMatch || blockedMatch;
  });

  const sortedWorkers = filteredWorkers.map(([name, w]) => {
    const keys = [...w.recently_blocked_keys].filter(([k]) =>
      k.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig) {
      keys.sort((a, b) => {
        const [_, countA, timeA] = a;
        const [__, countB, timeB] = b;
        if (sortConfig.key === "count") {
          return sortConfig.direction === "asc"
            ? countA - countB
            : countB - countA;
        } else {
          const dateA = new Date(timeA).getTime();
          const dateB = new Date(timeB).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
      });
    }

    return { name, w, keys };
  });

  const requestSort = (key: "count" | "time") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search worker or blocked key..."
        className="w-full mb-4 p-2 text-sm border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {sortedWorkers.map(({ name, w, keys }) => (
        <div key={name} className="mb-3 bg-white rounded shadow-sm p-2">
          <p className="font-medium">{name}</p>
          <div className="text-xs grid grid-cols-2 gap-2 mb-1">
            <p>Workers: {w.workers}</p>
            <p>Waiting: {w.waiting}</p>
            <p>Idle: {w.idle}</p>
            <p>Wait Time: {w.wait_time}ms</p>
            <p>Return Time: {w.time_to_return}ms</p>
          </div>

          {w.recently_blocked_keys.length > 0 && (
            <details className="col-span-2">
              <summary>
                Blocked Keys ({keys.length}) – sorted by{" "}
                <button
                  className="underline"
                  onClick={() => requestSort("count")}
                >
                  Count{" "}
                  {sortConfig?.key === "count"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>{" "}
                |{" "}
                <button
                  className="underline"
                  onClick={() => requestSort("time")}
                >
                  Time{" "}
                  {sortConfig?.key === "time"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>
              </summary>

              <table className="w-full text-xs mt-2 border-separate border-spacing-0.5">
                <thead>
                  <tr>
                    <th className="border p-1 text-left">Key</th>
                    <th className="border p-1 text-right">
                      <button onClick={() => requestSort("count")}>
                        Count{" "}
                        {sortConfig?.key === "count"
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </button>
                    </th>
                    <th className="border p-1 text-right">
                      <button onClick={() => requestSort("time")}>
                        Time{" "}
                        {sortConfig?.key === "time"
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map(([k, c, ts], idx) => (
                    <tr key={idx}>
                      <td className="border p-1">{k}</td>
                      <td className="border p-1 text-right">{c}</td>
                      <td className="border p-1 text-right">
                        {new Date(ts).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
      ))}

      {sortedWorkers.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No matches found.</p>
      )}
    </div>
  );
};

export default WorkerPools;
