import React from "react";
import FeedCard from "./FeedCard";
import FeedLikeButton from "./FeedLikeButton";
import FeedVoteButton from "./FeedVoteButton";

interface FeedListProps {
  feeds: any[];
  onFeedClick?: (feed: any) => void;
  onVoteClick?: (feed: any) => void;
  onLikeClick?: (feed: any) => void;
  onLikeCountClick?: (feed: any) => void;
  likedPosts?: number[];
}

const FeedList: React.FC<FeedListProps> = ({
  feeds,
  onFeedClick,
  onVoteClick,
  onLikeClick,
  onLikeCountClick,
  likedPosts,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {feeds.map((feed) => (
        <FeedCard
          key={feed.id}
          feed={feed}
          onClick={() => onFeedClick?.(feed)}
        >
          {/* 좋아요 버튼 */}
          <FeedLikeButton
            feedId={feed.id}
            likeCount={feed.likeCount || 0}
            isLiked={likedPosts?.includes(feed.id) || false}
            onLikeClick={(feedId: number) => onLikeClick?.({ ...feed, id: feedId })}
            onLikeCountClick={(feedId: number) => onLikeCountClick?.({ ...feed, id: feedId })}
          />
          
          {/* 투표 버튼 (이벤트 피드인 경우만) */}
          {feed.feedType === 'EVENT' && (
            <FeedVoteButton
              feedId={feed.id}
              feedType={feed.feedType}
              participantVoteCount={feed.participantVoteCount || 0}
              onVoteSuccess={(voteCount) => onVoteClick?.({ ...feed, participantVoteCount: voteCount })}
              onVoteError={(error) => console.error('투표 에러:', error)}
            />
          )}
        </FeedCard>
      ))}
    </div>
  );
};

export default FeedList;
