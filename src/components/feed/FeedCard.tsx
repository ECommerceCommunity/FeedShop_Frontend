import React from "react";

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
    feedType?: string;
    votes?: number;
  };
  onClick?: () => void;
  onVoteClick?: () => void;
  onLikeClick?: () => void;
  liked?: boolean;
  likes?: number;
}

const FeedCard: React.FC<FeedCardProps> = ({ feed, onClick, onVoteClick, onLikeClick, liked, likes }) => {
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
        <button
          className="flex items-center gap-1 focus:outline-none"
          onClick={e => { e.stopPropagation(); onLikeClick && onLikeClick(); }}
          disabled={liked}
        >
          <i className={`fas fa-heart ${liked ? 'text-red-500' : 'text-gray-300'}`}></i> {typeof likes === 'number' ? likes : feed.likes}
        </button>
      </div>
      {feed.feedType === 'event' && (
        <button
          className="mt-3 w-full bg-[#87CEEB] text-white py-2 rounded-lg font-medium hover:bg-blue-400 transition"
          onClick={e => { e.stopPropagation(); onVoteClick && onVoteClick(); }}
        >
          <i className="fas fa-vote-yea mr-1"></i> 투표하기{typeof feed.votes === 'number' ? ` (${feed.votes})` : ''}
        </button>
      )}
    </div>
  );
};

export default FeedCard; 