// app/feed/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';

// Add TypeScript declaration for Flashphoner on the Window interface
declare global {
  interface Window {
    Flashphoner: any;
  }
}

const cameras = [
  {
    id: 'camera1',
    name: 'Main Entrance',
    rtspUrl: 'rtsp://admin:akilicamera@154.70.45.143:554/mode=real&idc=1&ids=2'
  },
  {
    id: 'camera2',
    name: 'Hallway',
    rtspUrl: 'rtsp://admin:akilicamera@154.70.45.143:554/mode=real&idc=2&ids=2'
  },
  {
    id: 'camera3',
    name: 'Parking Lot',
    rtspUrl: 'rtsp://admin:akilicamera@154.70.45.143:554/mode=real&idc=3&ids=2'
  },
  {
    id: 'camera4',
    name: 'Hall way',
    rtspUrl: 'rtsp://admin:akilicamera@154.70.45.143:554/mode=real&idc=4&ids=2'
  }
];

export default function RTSPStream() {
  const [session, setSession] = useState<any>(null);
  const [streams, setStreams] = useState<{ [key: string]: any }>({});
  const [status, setStatus] = useState('Streams Inactive');
  const [FlashphonerLoaded, setFlashphonerLoaded] = useState(false);

  const videoRefs = useRef<{ [key: string]: any }>({});
  const PRELOADER_URL = "https://github.com/flashphoner/flashphoner_client/raw/wcs_api-2.0/examples/demo/dependencies/media/preloader.mp4";

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

  const startStream = (camera: any) => {
    if (!session) return;

    const STREAM_STATUS = window.Flashphoner.constants.STREAM_STATUS;
    const stream = session.createStream({
      name: camera.rtspUrl,
      display: videoRefs.current[camera.id]
    })
      .on(STREAM_STATUS.PLAYING, () => {
        setStatus(`${camera.name} Stream active`);
      })
      .on(STREAM_STATUS.FAILED, () => {
        setStatus(`${camera.name} Stream failed`);
      });

    stream.play();
    setStreams(prev => ({ ...prev, [camera.id]: stream }));
  };

  const stopStream = (camera: any) => {
    const stream = streams[camera.id];
    if (stream) stream.stop();
    setStreams(prev => {
      const updated = { ...prev };
      delete updated[camera.id];
      return updated;
    });
  };

  return (
    <>
      <Head>
        <title>RTSP Stream - School Surveillance</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
      </Head>
      <Script
        src="https://flashphoner.com/downloads/builds/flashphoner_client/wcs_api-2.0/current/flashphoner.js"
        onLoad={() => setFlashphonerLoaded(true)}
      />
      <main className="container py-4">
        <h2><i className="bi bi-camera-video me-2"></i>Live RTSP Streams</h2>
        <div className="badge bg-secondary my-2">{status}</div>

        <div className="row">
          {cameras.map(camera => (
            <div key={camera.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>{camera.name}</span>
                  <span className="badge bg-info">{streams[camera.id] ? 'Streaming' : 'Idle'}</span>
                </div>
                <div className="card-body">
                  <div ref={(el) => { videoRefs.current[camera.id] = el; }} style={{ width: '100%', height: '240px', background: '#000' }} />
                  <div className="d-flex justify-content-between mt-2">
                    <button className="btn btn-sm btn-primary" onClick={() => startStream(camera)}>
                      <i className="bi bi-play-circle me-1" />Start
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => stopStream(camera)}>
                      <i className="bi bi-stop-circle me-1" />Stop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}