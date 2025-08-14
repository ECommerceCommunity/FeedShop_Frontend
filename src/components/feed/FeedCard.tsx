import React from "react";

interface FeedCardProps {
  feed: {
    id: number;
    images?: Array<{ imageUrl: string }>;
    title: string;
    content: string;
    user?: {
      nickname: string;
    };
    createdAt?: string;
    likeCount?: number;
    orderItem?: {
      size?: number;
    };
    feedType?: string;
    participantVoteCount?: number;
  };
  onClick?: () => void;
  children?: React.ReactNode; // 하위 컴포넌트들을 위한 슬롯
}

const FeedCard: React.FC<FeedCardProps> = ({ 
  feed, 
  onClick, 
  children 
}) => {
  const imageUrl = feed.images && feed.images.length > 0 ? feed.images[0].imageUrl : 'https://via.placeholder.com/300x400?text=No+Image';
  
  return (
    <div className="border p-4 rounded-lg hover:shadow flex flex-col cursor-pointer" onClick={onClick}>
      <img src={imageUrl} alt={feed.title} className="aspect-[3/4] object-cover rounded" />
      <h3 className="mt-2 text-gray-900 line-clamp-2 font-semibold">{feed.title}</h3>
      <p className="text-gray-500 text-sm mb-2 line-clamp-2">{feed.content}</p>
      {feed.orderItem?.size && (
        <p className="text-gray-500 text-xs mb-1">신발 사이즈: {feed.orderItem.size}mm</p>
      )}
      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
        {feed.user?.nickname && <span>{feed.user.nickname}</span>}
        {feed.createdAt && <span>{new Date(feed.createdAt).toLocaleDateString()}</span>}
      </div>
      
      {/* 하위 컴포넌트들을 위한 슬롯 */}
      {children}
    </div>
  );
};

export default FeedCard; 