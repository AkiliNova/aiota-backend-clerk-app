import { useEffect, useRef, useState } from "react";

type Face = {
  id: string;
  name: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  recognized: boolean;
};

const FACE_API_URL = "http://localhost:8080/api/faces"; // Adjust to your backend

const FaceRecognitionFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faces, setFaces] = useState<Face[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  // Start webcam
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setAlert("Camera access denied");
      });
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Poll backend for face recognition results
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(FACE_API_URL);
        const data = await res.json();
        setFaces(data.faces || []);
        // Show alert if any face is unrecognized or unauthorized
        const unrecognized = data.faces?.find((f: Face) => !f.recognized);
        setAlert(unrecognized ? "Unrecognized/unauthorized person detected!" : null);
      } catch {
        setAlert("Failed to fetch face recognition results");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Draw bounding boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faces.forEach((face) => {
      const [x, y, w, h] = face.bbox;
      ctx.strokeStyle = face.recognized ? "lime" : "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.font = "14px Arial";
      ctx.fillStyle = face.recognized ? "lime" : "red";
      ctx.fillText(face.recognized ? face.name : "Unknown", x, y - 5);
    });
  }, [faces]);

  return (
    <div className="relative w-full max-w-lg">
      <video
        ref={videoRef}
        autoPlay
        muted
        width={640}
        height={480}
        className="rounded"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 2, pointerEvents: "none" }}
      />
      {alert && (
        <div className="absolute top-2 left-2 bg-red-600 text-white px-4 py-2 rounded z-10">
          {alert}
        </div>
      )}
    </div>
  );
};

export default FaceRecognitionFeed;
