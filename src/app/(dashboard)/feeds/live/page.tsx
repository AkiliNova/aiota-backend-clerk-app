'use client';

import { useState } from 'react';

const sections = ['All', 'Basement', 'Backyard', 'Front Door', 'Dining Hall', 'Kitchen'];

const cameraFeeds = [
  { section: 'Basement', title: 'Camera 1', time: '16-05-2024, 12:49 PM', img: '/basement.png' },
  { section: 'Basement', title: 'Camera 2', time: '16-05-2024, 12:49 PM', img: '/basement2.jpg' },
  { section: 'Backyard', title: 'Camera 3', time: '6-05-2024, 12:49 PM', img: '/backyard.jpeg' },
  { section: 'Backyard', title: 'Camera 4', time: '6-05-2024, 12:49 PM', img: '/backyard2.jpg' },
  // Add more cameras here
];

const feedEvents = [
  { camera: 'Front Door 2', time: '5 mins ago', thumb: '/frontdoor2.jpg' },
  { camera: 'Front Door 1', time: '10 mins ago', thumb: '/frontdoor1.jpg' },
  // Add more events here
];

export default function SurveillancePage() {
  const [activeSection, setActiveSection] = useState('All');

  const groupedFeeds = cameraFeeds.reduce((acc, feed) => {
    if (!acc[feed.section]) {
      acc[feed.section] = [];
    }
    acc[feed.section].push(feed);
    return acc;
  }, {} as Record<string, typeof cameraFeeds>);

  return (
    <div className="flex min-h-screen bg-pureWhite">
      
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r flex flex-col items-center space-y-6 py-6">
        <div className="w-8 h-8 bg-gray-300 rounded"></div> {/* Logo */}
        <nav className="flex flex-col space-y-6">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        
        {/* Top Tabs */}
        <div className="flex space-x-4 mb-6">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeSection === section
                  ? 'bg-deepBlack text-pureWhite'
                  : 'bg-gray-200 text-gray-700 hover:text-akiliRed hover:border-akiliRed hover:border'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Grouped Camera Feeds */}
        <div className="space-y-8">
          {Object.entries(groupedFeeds)
            .filter(([section]) => activeSection === 'All' || activeSection === section)
            .map(([section, feeds]) => (
              <div key={section}>
                <h2 className="text-lg font-semibold mb-4 text-deepBlack">{section}</h2>
                <div className="grid grid-cols-2 gap-6">
                  {feeds.map((feed, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden shadow bg-pureWhite relative border border-gray-100"
                    >
                      <img src={feed.img} alt={feed.title} className="w-full h-72 object-cover" />
                      <div className="absolute bottom-2 left-2 bg-deepBlack bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        <div className="font-medium">{feed.title}</div>
                        <div className="text-[11px]">{feed.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Feed Sidebar */}
      <aside className="w-64 bg-white border-l p-6 flex flex-col">
        <div className="font-semibold text-akiliRed mb-4">Feed</div>
        <div className="space-y-4 overflow-y-auto">
          {feedEvents.map((event, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <img
                src={event.thumb}
                alt={event.camera}
                className="w-16 h-10 object-cover rounded border border-gray-200"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-deepBlack">{event.camera}</div>
                <div className="text-xs text-akiliRed">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
