"use client";
import React from "react";

const AccessLogChart = () => {
  const logs = [
    { time: "08:01 AM", name: "John Doe", role: "Student" },
    { time: "08:02 AM", name: "Jane Nyambura", role: "Teacher" },
    { time: "08:05 AM", name: "Peter Kimani", role: "Student" },
  ];

  return (
    <div className="bg-white p-4 shadow rounded-2xl h-full">
      <h2 className="text-lg font-semibold mb-4">Recent Gate Access Logs</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        {logs.map((log, index) => (
          <li key={index} className="border-b py-1">
            {log.time} - {log.name} ({log.role})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccessLogChart;