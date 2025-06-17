"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  eventType: string;
  description: string;
  timestamp: string;
  camera: {
    zone?: { name: string };
    ipAddress: string;
  };
}

export default function SurveillanceFeedSummary() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/alerts/client");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow h-[300px] flex flex-col">
      <h2 className="text-lg font-semibold mb-2">🔴 Live Surveillance Feed</h2>
      <div
        className="flex-1 overflow-hidden relative"
        style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
      >
        <div className="flex flex-col animate-vertical-scroll space-y-2 pr-2">
          {events.length === 0 && (
            <div className="text-gray-500 text-sm p-2">No recent events</div>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-2 rounded flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition"
            >
              <div>
                <div className="font-bold text-sm">{event.eventType}</div>
                <div className="text-sm text-gray-600">{event.description}</div>
                <div className="text-xs text-gray-500">
                  Zone: {event.camera.zone?.name || "N/A"} | IP:{" "}
                  {event.camera.ipAddress}
                </div>
              </div>
              <div className="text-xs text-gray-500 pl-2 whitespace-nowrap">
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

