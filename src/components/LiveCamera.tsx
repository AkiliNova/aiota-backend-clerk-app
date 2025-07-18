'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface LiveCameraProps {
  id: string;
  streamUrl: string; // HLS stream URL (e.g., .m3u8)
}

export default function LiveCamera({ id, streamUrl }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <video
      id={`video_${id}`}
      ref={videoRef}
      autoPlay
      muted
      controls
      playsInline
      style={{ width: '100%', height: '288px', backgroundColor: '#000' }}
    />
  );
}
