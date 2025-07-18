// components/CameraFeed.tsx
type CameraFeedProps = {
  feed: {
    img: string;
    title: string;
    time: string;
  };
};

export default function CameraFeed({ feed }: CameraFeedProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow bg-pureWhite relative border border-gray-100">
      <img src={feed.img} alt={feed.title} className="w-full h-72 object-cover" />
      <div className="absolute bottom-2 left-2 bg-deepBlack bg-opacity-60 text-white text-xs px-2 py-1 rounded">
        <div className="font-medium">{feed.title}</div>
        <div className="text-[11px]">{feed.time}</div>
      </div>
    </div>
  );
}
