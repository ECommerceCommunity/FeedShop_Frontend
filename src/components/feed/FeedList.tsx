import React from "react";
import FeedCard from "./FeedCard";
import { useAuth } from "../../contexts/AuthContext";

interface FeedListProps {
  feeds: any[];
  onFeedClick?: (feed: any) => void;
  onVoteClick?: (feed: any) => void;
  onLikeClick?: (feed: any) => void;
  onLikeCountClick?: (feed: any) => void; // 좋아요 수 클릭 이벤트 추가
  likedPosts?: number[];
}

const FeedList: React.FC<FeedListProps> = ({
  feeds,
  onFeedClick,
  onVoteClick,
  onLikeClick,
  onLikeCountClick, // 좋아요 수 클릭 핸들러 추가
  likedPosts,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {feeds.map((feed) => (
        <FeedCard
          key={feed.id}
          feed={feed}
          onClick={() => onFeedClick?.(feed)}
          onVoteClick={
            feed.feedType === "event" ? () => onVoteClick?.(feed) : undefined
          }
          onLikeClick={() => onLikeClick?.(feed)}
          onLikeCountClick={() => onLikeCountClick?.(feed)} // 좋아요 수 클릭 이벤트 전달
          liked={likedPosts?.includes(feed.id)}
          likes={feed.likeCount}
        />
      ))}
    </div>
  );
};

export default FeedList;
