import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import type { EndpointData } from "@shared/types/EndpointData";
import ServiceHealth from "./ServiceHealth";
import ServerStats from "./ServerStats";
import WorkerPools from "./WorkerPools";

interface RegionModalProps {
  region: EndpointData;
  onClose: () => void;
}

const RegionModal: React.FC<RegionModalProps> = ({ region, onClose }) => {
  const stats = region.stats.server;
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    console.log("Rendering modal for:", region.region);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [region, onClose]);

  const toggle = (name: string) => {
    setExpanded((prev) => (prev === name ? null : name));
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">{region.region} Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          Version: {region.version} | Roles: {region.roles?.join(", ") || "—"}
        </p>

        <ServiceHealth services={region.services} />
        <ServerStats stats={region.stats} />

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Worker Pools</h3>
          <div className="divide-y divide-gray-200">
            {stats.workers.map(([name, w]) => (
              <div key={name} className="py-2">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggle(name)}
                >
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-gray-500">
                    {expanded === name ? "▼" : "▶"}
                  </span>
                </button>

                <div className="ml-4 mt-2 grid grid-cols-2 gap-2 text-xs">
                  <p>Workers: {w.workers}</p>
                  <p>Waiting: {w.waiting}</p>
                  <p>Idle: {w.idle}</p>
                  <p>Wait Time: {w.wait_time}ms</p>
                  <p>Return Time: {w.time_to_return}ms</p>
                </div>

                {expanded === name && w.recently_blocked_keys.length > 0 && (
                  <table className="w-full text-xs mt-2 border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-1 text-left">Key</th>
                        <th className="border p-1 text-right">Count</th>
                        <th className="border p-1 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {w.recently_blocked_keys.map(([k, c, ts], idx) => (
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RegionModal;
