import { useEffect, useRef, useState } from "react";

const ObjectDetectionFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [objects, setObjects] = useState<any[]>([]);
  // ...fetch object detection results from backend...
  // ...draw bounding boxes and show alerts...
  return (
    <div className="relative">
      <video ref={videoRef} autoPlay muted />
      {/* Canvas overlay for object bounding boxes */}
      {/* Alerts UI */}
    </div>
  );
};

export default ObjectDetectionFeed;
