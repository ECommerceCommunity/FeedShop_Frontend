import React from "react";

interface FeedLikeButtonProps {
  feedId: number;
  likeCount: number;
  isLiked: boolean;
  onLikeClick: (feedId: number) => void;
  onLikeCountClick: (feedId: number) => void;
}

const FeedLikeButton: React.FC<FeedLikeButtonProps> = ({
  feedId,
  likeCount,
  isLiked,
  onLikeClick,
  onLikeCountClick,
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        className="flex items-center focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onLikeClick(feedId);
        }}
      >
        <i className={`fas fa-heart ${isLiked ? 'text-red-500' : 'text-gray-300'}`}></i>
      </button>
      <span
        onClick={(e) => {
          e.stopPropagation();
          onLikeCountClick(feedId);
        }}
        className="cursor-pointer hover:text-[#87CEEB] ml-1"
      >
        {likeCount}
      </span>
    </div>
  );
};

export default FeedLikeButton;
