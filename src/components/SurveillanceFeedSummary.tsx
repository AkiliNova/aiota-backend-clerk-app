"use client";
import React from "react";

const SurveillanceFeedSummary = () => {
  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-2">Live Surveillance Summary</h2>
      <ul className="text-sm text-gray-600">
        <li>• 3 Cameras Active
        </li>
        <li>• Last Incident: Phone detected in Class 4B</li>
        <li>• 2 Alerts under review</li>
        <li>• Feed Latency: 0.8s</li>
      </ul>
    </div>
  );
};
export default SurveillanceFeedSummary;
