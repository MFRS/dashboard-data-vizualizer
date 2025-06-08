import React from "react";
import type { EndpointData } from "../types/EndpointData";

const WorkerPools: React.FC<{
  workers: EndpointData["stats"]["server"]["workers"];
}> = ({ workers }) => {
  return (
    <div className="mt-2">
      {workers.map(([name, w]) => (
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
                  {w.recently_blocked_keys.map(([k, c, ts], idx) => (
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
    </div>
  );
};

export default WorkerPools;
