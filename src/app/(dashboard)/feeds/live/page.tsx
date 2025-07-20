'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { BiPlayCircle, BiStopCircle, BiFullscreen, BiGridAlt, BiMenu } from 'react-icons/bi';
import { MdOutlineGridView } from 'react-icons/md';
import { IoGridOutline } from 'react-icons/io5';
import { FiSettings, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { RiCameraLensFill } from 'react-icons/ri';

const cameras = [
  {
    id: 'camera1',
    section: 'Basement',
    name: 'Gym Camera',
    rtspUrl: 'rtsp://admin:akilicamera@197.237.111.26:554/mode=real&idc=1&ids=2',
    status: 'active'
  },
  {
    id: 'camera2',
    section: 'Basement',
    name: 'Workout Area',
    rtspUrl: 'rtsp://admin:akilicamera@197.237.111.26:554/mode=real&idc=2&ids=2',
    status: 'active'
  },
  {
    id: 'camera3',
    section: 'Backyard',
    name: 'Garden Entrance',
    rtspUrl: 'rtsp://admin:akilicamera@197.237.111.26:554/mode=real&idc=3&ids=2',
    status: 'active'
  },
  {
    id: 'camera4',
    section: 'Backyard',
    name: 'Pool View',
    rtspUrl: 'rtsp://admin:akilicamera@197.237.111.26:554/mode=real&idc=4&ids=2',
    status: 'active'
  }
];

const sections = ['All', ...Array.from(new Set(cameras.map(c => c.section)))];

export default function RTSPStream() {
  const [session, setSession] = useState<any>(null);
  const [streams, setStreams] = useState<{ [key: string]: any }>({});
  const [status, setStatus] = useState('Streams Inactive');
  const [FlashphonerLoaded, setFlashphonerLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('All');
  const [expandedCamera, setExpandedCamera] = useState<string | null>(null);
  const [gridLayout, setGridLayout] = useState<'2x2' | '3x3' | '4x4'>('2x2');
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredCamera, setHoveredCamera] = useState<string | null>(null);

  const videoRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    if (!FlashphonerLoaded || typeof window === 'undefined') return;
    window.Flashphoner.init({});

    const SESSION_STATUS = window.Flashphoner.constants.SESSION_STATUS;

    const newSession = window.Flashphoner.createSession({
      urlServer: "wss://demo.flashphoner.com:8443"
    })
      .on(SESSION_STATUS.ESTABLISHED, () => setStatus('Connected'))
      .on(SESSION_STATUS.DISCONNECTED, () => setStatus('Disconnected'))
      .on(SESSION_STATUS.FAILED, () => setStatus('Connection failed'));

    setSession(newSession);
  }, [FlashphonerLoaded]);

  const startStream = async (camera: any) => {
    if (!session) {
      setStatus('Connecting to server...');
      try {
        const SESSION_STATUS = window.Flashphoner.constants.SESSION_STATUS;
        const newSession = await window.Flashphoner.createSession({
          urlServer: "wss://demo.flashphoner.com:8443"
        })
          .on(SESSION_STATUS.ESTABLISHED, () => setStatus('Connected'))
          .on(SESSION_STATUS.DISCONNECTED, () => setStatus('Disconnected'))
          .on(SESSION_STATUS.FAILED, () => setStatus('Connection failed'));
        
        setSession(newSession);
      } catch (error) {
        setStatus('Failed to connect to server');
        return;
      }
    }

    try {
      setStatus(`Connecting to ${camera.name}...`);
      const STREAM_STATUS = window.Flashphoner.constants.STREAM_STATUS;
      
      const stream = session.createStream({
        name: camera.rtspUrl,
        display: videoRefs.current[camera.id],
        constraints: {
          video: true,
          audio: true
        },
        rtspUrl: camera.rtspUrl,
        mediaProvider: "WebRTC", // or "Flash" for older browsers
        receiverLocation: "client",
        useCanvasMediaStream: true
      });

      stream
        .on(STREAM_STATUS.PLAYING, () => {
          setStatus(`${camera.name} stream active`);
          setStreams(prev => ({ ...prev, [camera.id]: stream }));
        })
        .on(STREAM_STATUS.FAILED, () => {
          setStatus(`${camera.name} stream failed`);
          stopStream(camera);
        })
        .on(STREAM_STATUS.STOPPED, () => {
          setStatus(`${camera.name} stream stopped`);
          stopStream(camera);
        })
        .on(STREAM_STATUS.NOT_ENOUGH_BANDWIDTH, () => {
          setStatus(`${camera.name} - bandwidth issues`);
        });

      await stream.play();
    } catch (error) {
      console.error('Stream start error:', error);
      setStatus(`Failed to start ${camera.name} stream`);
      stopStream(camera);
    }
  };

  const stopStream = (camera: any) => {
    try {
      const stream = streams[camera.id];
      if (stream) {
        stream.stop();
        setStatus(`${camera.name} stream stopped`);
      }
      setStreams(prev => {
        const updated = { ...prev };
        delete updated[camera.id];
        return updated;
      });
    } catch (error) {
      console.error('Stream stop error:', error);
      setStatus(`Failed to stop ${camera.name} stream`);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCamera(prev => (prev === id ? null : id));
  };

  const getGridClass = () => {
    if (expandedCamera) return 'grid-cols-1';
    switch (gridLayout) {
      case '2x2': return 'grid-cols-1 sm:grid-cols-2';
      case '3x3': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case '4x4': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f172a]">
      <Script
        src="https://flashphoner.com/downloads/builds/flashphoner_client/wcs_api-2.0/current/flashphoner.js"
        onLoad={() => setFlashphonerLoaded(true)}
      />

      {/* Left Sidebar - Controls */}
      <aside className="w-full lg:w-16 bg-[#1e293b] border-r border-[#334155] flex lg:flex-col items-center justify-between lg:justify-start px-4 py-4 z-10">
        <div className="flex lg:flex-col items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#334155] rounded-lg transition-all text-white"
          >
            <BiMenu className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-[#334155] rounded-lg transition-all text-white"
          >
            <FiSettings className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex lg:flex-col items-center gap-4 mt-8">
          {[
            { icon: BiGridAlt, layout: '2x2' },
            { icon: MdOutlineGridView, layout: '3x3' },
            { icon: IoGridOutline, layout: '4x4' }
          ].map(({ icon: Icon, layout }) => (
            <button 
              key={layout}
              onClick={() => setGridLayout(layout as '2x2' | '3x3' | '4x4')}
              className={`p-2 rounded-lg transition-all ${
                gridLayout === layout 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:bg-[#334155] hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'Connected' 
                ? 'bg-green-500/20 text-green-400'
                : status === 'Disconnected'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {status}
            </div>
          </div>
        </div>

        {/* Camera Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className={`grid gap-4 ${getGridClass()}`}>
            {cameras
              .filter(c => activeSection === 'All' || c.section === activeSection)
              .map(camera => (
                <div
                  key={camera.id}
                  className={`group relative bg-[#1e293b] rounded-xl overflow-hidden transition-all ${
                    expandedCamera === camera.id ? 'col-span-full row-span-full h-[85vh]' : 'aspect-video'
                  }`}
                  onMouseEnter={() => setHoveredCamera(camera.id)}
                  onMouseLeave={() => setHoveredCamera(null)}
                >
                  {/* Video Container */}
                  <div
                    ref={(el) => {
                      if (el) videoRefs.current[camera.id] = el;
                    }}
                    className="absolute inset-0 bg-[#0f172a] flex items-center justify-center"
                  >
                    {!streams[camera.id] && (
                      <div className="flex flex-col items-center text-gray-500">
                        <RiCameraLensFill className="w-12 h-12 mb-2" />
                        <span className="text-sm">Stream Offline</span>
                      </div>
                    )}
                  </div>

                  {/* Permanent Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{camera.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            streams[camera.id] 
                              ? 'bg-green-500 animate-pulse' 
                              : 'bg-gray-500'
                          }`} />
                          <span className="text-xs text-gray-300">
                            {streams[camera.id] ? 'Live' : 'Offline'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stream Controls */}
                        {!streams[camera.id] ? (
                          <button
                            onClick={() => startStream(camera)}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-1 transition-all"
                          >
                            <BiPlayCircle className="w-5 h-5" />
                            <span className="text-sm">Start</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => stopStream(camera)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1 transition-all"
                          >
                            <BiStopCircle className="w-5 h-5" />
                            <span className="text-sm">Stop</span>
                          </button>
                        )}
                        
                        {/* Expand Button */}
                        <button
                          onClick={() => toggleExpand(camera.id)}
                          className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                        >
                          {expandedCamera === camera.id 
                            ? <FiMinimize2 className="w-5 h-5" />
                            : <FiMaximize2 className="w-5 h-5" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Active Streams */}
      {sidebarOpen && (
        <aside className="hidden lg:flex w-80 bg-[#1e293b] border-l border-[#334155] flex-col">
          <div className="p-4 border-b border-[#334155]">
            <h2 className="font-semibold text-white">Active Streams</h2>
            <p className="text-sm text-gray-400 mt-1">
              {Object.keys(streams).length} cameras streaming
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {Object.keys(streams).map((id) => {
                const camera = cameras.find(c => c.id === id);
                return (
                  <div key={id} className="flex items-center gap-4 p-3 bg-[#0f172a] rounded-lg group hover:bg-[#334155] transition-all">
                    <div className="w-20 h-12 bg-black rounded-lg flex-shrink-0 flex items-center justify-center">
                      <RiCameraLensFill className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{camera?.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-gray-400">Live Now</span>
                      </div>
                    </div>
                    <button
                      onClick={() => camera && stopStream(camera)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <BiStopCircle className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl p-6 w-full max-w-md border border-[#334155]">
            <h2 className="text-xl font-semibold text-white mb-4">Stream Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Grid Layout</label>
                <select 
                  value={gridLayout}
                  onChange={(e) => setGridLayout(e.target.value as '2x2' | '3x3' | '4x4')}
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg px-3 py-2"
                >
                  <option value="2x2">2x2 Grid</option>
                  <option value="3x3">3x3 Grid</option>
                  <option value="4x4">4x4 Grid</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#334155] rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
