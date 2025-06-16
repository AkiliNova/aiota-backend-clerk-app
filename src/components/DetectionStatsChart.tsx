"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

const data = [
  { type: "Phones", count: 12 },
  { type: "Knives", count: 1 },
  { type: "Guns", count: 0 },
  { type: "Sharp Objects", count: 4 },
];

const DetectionStatsChart = () => {
  return (
    <div className="bg-white p-4 shadow rounded-2xl h-full">
      <h2 className="text-lg font-semibold mb-4">Object Detection Summary</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetectionStatsChart;