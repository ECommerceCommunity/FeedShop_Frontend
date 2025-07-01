import React from "react";
import FeedCard from "./FeedCard";

interface FeedListProps {
  feeds: any[];
  onFeedClick?: (feed: any) => void;
}

const FeedList: React.FC<FeedListProps> = ({ feeds, onFeedClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {feeds.map(feed => (
        <FeedCard key={feed.id} feed={feed} onClick={() => onFeedClick?.(feed)} />
      ))}
    </div>
  );
};

export default FeedList; 