import React, { useEffect, useRef } from "react";
import type { EndpointData } from "@shared/types/EndpointData";
import WorkerPools from "./WorkerPools";

interface RegionModalProps {
  region: EndpointData;
  onClose: () => void;
}

const RegionModal: React.FC<RegionModalProps> = ({ region, onClose }) => {
  const stats = region.stats.server;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">{region.region} Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          Version: {region.version} | Roles: {region.roles?.join(", ") ?? "—"}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Status:</strong> {region.status}
            </p>
            <p>
              <strong>CPU Load:</strong> {(stats.cpu_load * 100).toFixed(1)}%
            </p>
            <p>
              <strong>Connections:</strong> {stats.active_connections}
            </p>
            <p>
              <strong>Wait Time:</strong> {stats.wait_time} ms
            </p>
          </div>
          <div>
            <p>
              <strong>Sessions:</strong> {region.stats.session}
            </p>
            <p>
              <strong>Servers Count:</strong> {region.stats.servers_count}
            </p>
            <p>
              <strong>Timers:</strong> {stats.timers}
            </p>
            <p>
              <strong>Load:</strong> {region.load ?? "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Services</h3>
          <ul className="list-disc list-inside text-sm">
            {Object.entries(region.services).map(([key, value]) => (
              <li
                key={key}
                className={value ? "text-green-700" : "text-red-600"}
              >
                {key}: {value ? "Available" : "Down"}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Worker Pools</h3>
          <WorkerPools workers={stats.workers} />
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
