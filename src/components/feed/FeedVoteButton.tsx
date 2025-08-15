import React from "react";

interface FeedVoteButtonProps {
  feedId: number;
  participantVoteCount: number;
  onVoteClick: (feedId: number) => void;
}

const FeedVoteButton: React.FC<FeedVoteButtonProps> = ({
  feedId,
  participantVoteCount,
  onVoteClick,
}) => {
  return (
    <button
      className="mt-3 w-full bg-[#87CEEB] text-white py-2 rounded-lg font-medium hover:bg-blue-400 transition"
      onClick={(e) => {
        e.stopPropagation();
        onVoteClick(feedId);
      }}
    >
      <i className="fas fa-vote-yea mr-1"></i> 투표하기 ({participantVoteCount})
    </button>
  );
};

export default FeedVoteButton;
