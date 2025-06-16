"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

const truancyData = [
  { day: "Mon", count: 1 },
  { day: "Tue", count: 2 },
  { day: "Wed", count: 4 },
  { day: "Thu", count: 2 },
  { day: "Fri", count: 1 },
];

const TruancyReportChart = () => {
  return (
    <div className="bg-white p-4 shadow rounded-2xl h-full">
      <h2 className="text-lg font-semibold mb-4">Weekly Truancy Report</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={truancyData}>
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TruancyReportChart;
