import React, { useEffect } from "react";
import type { EndpointData } from "@shared/types/EndpointData";

interface RegionModalProps {
  region: EndpointData;
  onClose: () => void;
}

const RegionModal: React.FC<RegionModalProps> = ({ region, onClose }) => {
  const stats = region.stats?.server;
  const roles = Array.isArray(region.roles) ? region.roles : [];

  useEffect(() => {
    console.log("Rendering modal for region:", region);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [region, onClose]);

  return (
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
          Version: {region.version} | Roles: {roles.join(", ")}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Status:</strong> {region.status}
            </p>
            <p>
              <strong>CPU Load:</strong>{" "}
              {(stats?.cpu_load * 100).toFixed(1) || "N/A"}%
            </p>
            <p>
              <strong>Connections:</strong> {stats?.active_connections ?? "N/A"}
            </p>
            <p>
              <strong>Wait Time:</strong> {stats?.wait_time} ms
            </p>
          </div>
          <div>
            <p>
              <strong>Sessions:</strong> {region.stats?.session ?? "N/A"}
            </p>
            <p>
              <strong>Servers Count:</strong>{" "}
              {region.stats?.servers_count ?? "N/A"}
            </p>
            <p>
              <strong>Timers:</strong> {stats?.timers ?? "N/A"}
            </p>
            <p>
              <strong>Load:</strong> {region.load ?? "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Services</h3>
          <ul className="list-disc list-inside text-sm">
            {Object.entries(region.services ?? {}).map(([key, value]) => (
              <li
                key={key}
                className={value ? "text-green-700" : "text-red-600"}
              >
                {key}: {value ? "Available" : "Down"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
