import { FC } from "react";

interface FeedCardProps {
  feed: {
    id: number;
    image: string;
    title: string;
    description: string;
    author?: string;
    date?: string;
    likes?: number;
    size?: number;
  };
  onClick?: () => void;
}

const FeedCard: FC<FeedCardProps> = ({ feed, onClick }) => {
  return (
    <div className="border p-4 rounded-lg hover:shadow flex flex-col cursor-pointer" onClick={onClick}>
      <img src={feed.image} alt={feed.title} className="aspect-[3/4] object-cover rounded" />
      <h3 className="mt-2 text-gray-900 line-clamp-2 font-semibold">{feed.title}</h3>
      <p className="text-gray-500 text-sm mb-2 line-clamp-2">{feed.description}</p>
      {feed.size && (
        <p className="text-gray-500 text-xs mb-1">신발 사이즈: {feed.size}mm</p>
      )}
      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
        {feed.author && <span>{feed.author}</span>}
        {feed.date && <span>{feed.date}</span>}
        {typeof feed.likes === "number" && (
          <span className="flex items-center gap-1">
            <i className="fas fa-heart text-pink-400"></i> {feed.likes}
          </span>
        )}
      </div>
    </div>
  );
};

export default FeedCard; 