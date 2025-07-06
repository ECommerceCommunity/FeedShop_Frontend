import React from "react";
import FeedCard from "./FeedCard";

interface FeedListProps {
  feeds: any[];
  onFeedClick?: (feed: any) => void;
  onVoteClick?: (feed: any) => void;
  onLikeClick?: (feed: any) => void;
  likedPosts?: number[];
}

const FeedList: React.FC<FeedListProps> = ({ feeds, onFeedClick, onVoteClick, onLikeClick, likedPosts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {feeds.map(feed => (
        <FeedCard
          key={feed.id}
          feed={feed}
          onClick={() => onFeedClick?.(feed)}
          onVoteClick={feed.feedType === 'event' ? () => onVoteClick?.(feed) : undefined}
          onLikeClick={() => onLikeClick?.(feed)}
          liked={likedPosts?.includes(feed.id)}
          likes={feed.likes}
        />
      ))}
    </div>
  );
};

export default FeedList; 