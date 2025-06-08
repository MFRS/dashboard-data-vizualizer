import React from "react";

interface BlockedKey {
  key: string;
  count: number;
  time: string;
}

const BlockedKeysTable: React.FC<{ blockedKeys: BlockedKey[] }> = ({
  blockedKeys,
}) => {
  const totalBlocked = blockedKeys.reduce((sum, k) => sum + k.count, 0);
  const top = [...blockedKeys].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="bg-white border rounded p-4 shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Blocked Keys</h3>
        <span className="text-sm text-gray-600">
          Total:{" "}
          <strong className="text-red-600">
            {totalBlocked.toLocaleString()}
          </strong>
        </span>
      </div>

      <table className="w-full text-xs table-fixed">
        <thead>
          <tr className="text-left border-b text-gray-600">
            <th className="w-1/2">Key</th>
            <th className="w-1/4">Count</th>
            <th className="w-1/4">Time</th>
          </tr>
        </thead>
        <tbody>
          {top.map((key, i) => (
            <tr key={i} className="border-t">
              <td className="truncate pr-2">{key.key}</td>
              <td className="text-red-700 font-medium">{key.count}</td>
              <td>{new Date(key.time).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockedKeysTable;
