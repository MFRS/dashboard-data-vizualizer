import React, { useEffect, useRef } from "react";
import WorkerPools from "./WorkerPools";
import BlockedKeysTable from "./BlockedKeysTable"; // 👈 NEW import
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { HistoricalData } from "@/types/type";

interface RegionModalProps {
  region: HistoricalData;
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
  //workers = [['_',{recently_blocked_keys:[['key',1,'25_']]}],['_']]
  const blockedKeys = stats.workers
    .flatMap(([, w]) => w.recently_blocked_keys)
    .map(([key, count, time]) => ({
      key,
      count,
      time: new Date(time).toISOString(),
    }));

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
          Version: {region.version} | Roles: {region?.roles?.join(", ") ?? "—"}
        </p>

        <div className="mt-4">
          <p className="font-medium mb-1">
            CPU Trend: {(stats.cpu_load * 100).toFixed(1)}%
          </p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart
              data={
                region.cpuHistory?.map((v: number, i: number) => ({
                  time: i,
                  cpu: v * 100,
                })) ?? []
              }
            >
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" />
              <ReferenceArea y1={80} y2={100} fill="red" fillOpacity={0.1} />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
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

        {blockedKeys.length > 0 && (
          <div className="mt-6">
            <BlockedKeysTable blockedKeys={blockedKeys} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionModal;
