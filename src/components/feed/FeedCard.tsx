import React from "react";
import FeedUserProfile from "./FeedUserProfile";

interface FeedCardProps {
  feed: {
    id: number;
    images?: Array<{ imageUrl: string }>;
    title: string;
    content: string;
    user?: {
      id?: number;
      nickname: string;
      profileImg?: string;
    };
    createdAt?: string;
    likeCount?: number;
    orderItem?: {
      size?: number;
    };
    feedType?: string;
    participantVoteCount?: number;
    // 이벤트 참여 관련 필드 추가
    eventId?: number;
    eventTitle?: string;
    eventType?: string;
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
  
  // 이벤트 타입에 따른 배지 색상 결정
  const getEventBadgeColor = (eventType?: string) => {
    switch (eventType) {
      case 'BATTLE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RANKING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="border p-4 rounded-lg hover:shadow flex flex-col cursor-pointer" onClick={onClick}>
      <img src={imageUrl} alt={feed.title} className="aspect-[3/4] object-cover rounded" />
      
      {/* 이벤트 참여 배지 */}
      {feed.eventId && feed.eventTitle && (
        <div className="mt-2 mb-1">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEventBadgeColor(feed.eventType)}`}>
            <i className="fas fa-star mr-1"></i>
            {feed.eventTitle}
          </span>
        </div>
      )}
      
      <h3 className="mt-2 text-gray-900 line-clamp-2 font-semibold">{feed.title}</h3>
      <p className="text-gray-500 text-sm mb-2 line-clamp-2">{feed.content}</p>
      {feed.orderItem?.size && (
        <p className="text-gray-500 text-xs mb-1">신발 사이즈: {feed.orderItem.size}mm</p>
      )}
      
      {/* 사용자 정보 */}
      {feed.user && (
        <div className="mt-2 mb-2">
          <FeedUserProfile
            userId={feed.user.id || 0}
            nickname={feed.user.nickname}
            profileImageUrl={feed.user.profileImg}
            showBodyInfo={true}
            size="small"
            onClick={() => {
              // 사용자 프로필 페이지로 이동 로직 추가 가능
              console.log('사용자 프로필 클릭:', feed.user?.nickname);
            }}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
        {feed.createdAt && <span>{new Date(feed.createdAt).toLocaleDateString()}</span>}
      </div>
      
      {/* 하위 컴포넌트들을 위한 슬롯 */}
      {children}
    </div>
  );
};

export default FeedCard; 