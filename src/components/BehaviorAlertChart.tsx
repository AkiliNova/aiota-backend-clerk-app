"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

const behaviorData = [
  { name: "Bullying", value: 3 },
  { name: "Fighting", value: 2 },
  { name: "Cheating", value: 1 },
];

const COLORS = ["#f43f5e", "#f97316", "#10b981"];

const BehaviorAlertChart = () => {
  return (
    <div className="bg-white p-4 shadow rounded-2xl h-full">
      <h2 className="text-lg font-semibold mb-4">Behavioral Alerts</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={behaviorData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {behaviorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BehaviorAlertChart;