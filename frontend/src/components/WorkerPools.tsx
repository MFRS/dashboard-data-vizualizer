import React, { useState, useEffect } from "react";
import type { EndpointData } from "../types/EndpointData";

type SortConfig = { key: "count" | "time"; direction: "asc" | "desc" };

const WorkerPools: React.FC<{
  workers: EndpointData["stats"]["server"]["workers"];
}> = ({ workers }) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Load persisted sort config
  useEffect(() => {
    const saved = localStorage.getItem("workerSort");
    if (saved) {
      setSortConfig(JSON.parse(saved));
    }
  }, []);

  // Persist sort config
  useEffect(() => {
    if (sortConfig) {
      localStorage.setItem("workerSort", JSON.stringify(sortConfig));
    } else {
      localStorage.removeItem("workerSort");
    }
  }, [sortConfig]);

  const filteredWorkers = workers.filter(([name, w]) => {
    const matchesName = name.toLowerCase().includes(search.toLowerCase());
    const matchesKey = w.recently_blocked_keys.some(([k]) =>
      k.toLowerCase().includes(search.toLowerCase())
    );
    return matchesName || matchesKey;
  });

  const sorted = filteredWorkers.map(([name, w]) => {
    const keys = [...w.recently_blocked_keys].filter(([k]) =>
      k.toLowerCase().includes(search.toLowerCase())
    );
    if (sortConfig) {
      keys.sort((a, b) => {
        const [, ca, ta] = a;
        const [, cb, tb] = b;
        if (sortConfig.key === "count") {
          return sortConfig.direction === "asc" ? ca - cb : cb - ca;
        } else {
          const da = +new Date(ta),
            db = +new Date(tb);
          return sortConfig.direction === "asc" ? da - db : db - da;
        }
      });
    }
    return { name, stats: w, keys };
  });

  const requestSort = (key: SortConfig["key"]) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
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

      {sorted.map(({ name, stats: w, keys }) => (
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
                Blocked Keys ({keys.length}) – Sort by{" "}
                <button
                  className="underline"
                  onClick={() => requestSort("count")}
                >
                  Count{" "}
                  {sortConfig?.key === "count" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>{" "}
                |{" "}
                <button
                  className="underline"
                  onClick={() => requestSort("time")}
                >
                  Time{" "}
                  {sortConfig?.key === "time" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>
              </summary>
              <table className="w-full text-xs mt-2 border-separate border-spacing-0.5">
                <thead>
                  <tr>
                    <th className="border p-1 text-left">Key</th>
                    <th className="border p-1 text-right">
                      <button onClick={() => requestSort("count")}>
                        Count{" "}
                        {sortConfig?.key === "count" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </button>
                    </th>
                    <th className="border p-1 text-right">
                      <button onClick={() => requestSort("time")}>
                        Time{" "}
                        {sortConfig?.key === "time" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
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

      {sorted.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No matches found.</p>
      )}
    </div>
  );
};

export default WorkerPools;
